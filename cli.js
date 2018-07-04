const { table, getBorderCharacters } = require('table')
const meow = require('meow')
const HDWallet = require('./index')

const cli = meow(`
    Usage
  $ ethereum_hdwallet [options]

    Options
      -i, --index Account Index (e.g. 4)
      -p, --properties Properties to display (e.g. address, publickey, privatekey, hdpath)
      -r, --range Account Index Range (e.g 1-100)
      -m, --mnemonic Mnemonic
      -h, --hdpath HD Path

    Examples
      $ ethereum_hdwallet -m "tag volcano eight thank tide danger coast health ab
ove argue embrace heavy" -r 0-10
  `, {
    string: [
      'property',
      'range',
      'mnemonic',
      'hdpath'
    ],
    number: [
      'index'
    ],
    alias: {
      i: 'index',
      p: 'property',
      r: 'range',
      m: 'mnemonic',
      h: 'hdpath'
    }
  }
)

const args = process.argv
const { flags, input } = cli

const options = {
  mnemonic: flags.mnemonic || flags.m || input[0],
  hdpath: flags.hdpath || flags.h,
  index: flags.index || flags.i,
  range: flags.range || flags.r,
  properties: flags.properties || flags.p
}

if (process.stdin) {
  process.stdin.setEncoding('utf8')
  process.stdin.resume()
  var content = ''
  process.stdin.on('data', (buf) => {
    content += buf.toString()
  })
  setTimeout(() => {
    options.mnemonic = (content || options.mnemonic || '').trim()
    run(options)
    process.exit(0)
  }, 10)
} else {
  run(options)
}

function run({mnemonic, index, range, hdpath, properties}) {
  if (!mnemonic) {
    console.error('Error: mnemonic is required')
    return
  }

  const hdwallet = new HDWallet(mnemonic, hdpath)

  var start = 0
  var end = 10

  if (index != undefined) {
    start = index
    if (start < 0) {
      start = 0
    }
    end = start + 1
    if (end < 0) {
      end = start + 1
    }
    if (start > end) {
      end = start + 1
    }
    if (end < start) {
      end = start + 1
    }
  } else if (range) {
    const parts = range.split('-')
    start = (parts[0]|0)
    end = (parts[1]|0)+1
    if (start < 0) {
      start = 0
    }
    if (end < 0) {
      end = start + 1
    }
    if (start > end) {
      end = start + 1
    }
    if (end < start) {
      end = start + 10
    }
    if (start > end) {
      start = 0
    }
  }

  const propertiesList = (properties || 'address').split(',').map(x => x.trim().toLowerCase())

  const headerKeys = {
    address: 'address',
    private: 'private key',
    public: 'public key',
    hdpath: 'hd path'
  }

  const props = []

  for (var i = 0; i < propertiesList.length; i++) {
    const property = propertiesList[i]
    var prop = null
    if (/address|(public.*address)|addr/.test(property)) {
      prop = 'address'
    } else if (/private|priv/.test(property)) {
      prop = 'private'
    } else if (/public|pub/.test(property)) {
      prop = 'public'
    } else if (/hdpath|hd/.test(property)) {
      prop = 'hdpath'
    }

    if (prop && props.indexOf(prop) === -1) {
      props.push(prop)
    }
  }

  const headers = []

  for (var i = 0; i < props.length; i++) {
    headers.push(headerKeys[props[i]])
  }

  const result = [['account', ...headers]]

  for (var i = start; i < end; i++) {
    const wallet = hdwallet.derive(i)
    const values = []
    for (var j = 0; j < props.length; j++) {
      const prop = props[j]
      var value = null
      if (prop === 'address') {
        value = '0x' + wallet.getAddress().toString('hex')
      } else if (prop === 'private') {
        value = wallet.getPrivateKey().toString('hex')
      } else if (prop === 'public') {
        value = wallet.getPublicKey().toString('hex')
      } else if (prop === 'hdpath') {
        value = wallet.hdpath()
      }

      if (value) {
        values.push(value)
      }
    }

    result.push([
      i,
      ...values
    ])
  }

  console.log(table(result, {
    border: getBorderCharacters('void'),
    columnDefault: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 1
    },
    drawHorizontalLine: () => {
      return false
    }
  }))
}
