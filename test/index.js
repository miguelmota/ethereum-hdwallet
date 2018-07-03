const test = require('tape')
const HDWallet = require('../')

test('hdwallet', t => {
  t.plan(5)

  const mnemonic = 'tag volcano eight thank tide danger coast health above argue embrace heavy'
  const hdwallet = new HDWallet(mnemonic)
  t.equal(hdwallet.hdpath(), `m/44'/60'/0'/0/`)

  t.equal(hdwallet.derive(0).getAddress().toString('hex'), 'c49926c4124cee1cba0ea94ea31a6c12318df947')
  t.equal(hdwallet.derive(0).getPrivateKey().toString('hex'), '63e21d10fd50155dbba0e7d3f7431a400b84b4c2ac1ee38872f82448fe3ecfb9')
  t.equal(hdwallet.derive(1).getAddress().toString('hex'), '8230645ac28a4edd1b0b53e7cd8019744e9dd559')

  const signedRawTx = hdwallet.derive(0).signTransaction({
    to: '0x0000000000000000000000000000000000000000',
    value: '0x0',
    data: '0x0'
  })

  t.equal(signedRawTx.toString('hex'), 'f85d80808094000000000000000000000000000000000000000080001ca0de4b34f17bf51d0b783082090c10d133dcc867c7e981c07cda5ddd1e3211f44ca02125dff6879141708899838356bc42df8815220069ce10507ae4ea980791dac4')
})
