const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')
const Transaction = require('ethereumjs-tx')
const EthCrypto = require('eth-crypto')
const isBuffer = require('is-buffer')

class Wallet {
  constructor (seed, hdpath = '') {
    let value = null
    if (typeof seed === 'string') {
      value = Buffer.from(seed)
    } else if (isBuffer(seed)) {
      value = seed
    } else {
      throw new Error('Seed must be Buffer or string')
    }

    this.__hdwallet = hdkey.fromMasterSeed(value)
    this.__hdpath = hdpath
  }

  hdpath () {
    return this.__hdpath
  }

  getAddress () {
    return this.__hdwallet.derivePath(this.__hdpath).getWallet().getAddress()
  }

  getPublicKey (compress = false) {
    const uncompressed = this.__hdwallet.derivePath(this.__hdpath).getWallet().getPublicKey()
    if (compress) {
      return Buffer.from(EthCrypto.publicKey.compress(uncompressed.toString('hex')), 'hex')
    }
    return uncompressed
  }

  getPrivateKey () {
    return this.__hdwallet.derivePath(this.__hdpath).getWallet().getPrivateKey()
  }

  signTransaction (txParams) {
    const wallet = this.__hdwallet.derivePath(this.__hdpath).getWallet()
    txParams.from = txParams.from || '0x' + wallet.getAddress().toString('hex')
    const tx = new Transaction(txParams)
    const priv = wallet.getPrivateKey()
    tx.sign(priv)
    return tx.serialize()
  }

  derive (hdpath) {
    if (typeof hdpath === undefined) return this
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    if (/^[0-9]+'?$/.test(hdpath)) {
      hdpath = `/${hdpath}`
    }
    clone.__hdpath = this.__hdpath + hdpath
    return clone
  }
}

const HDWallet = {
  fromMnemonic: (mnemonic) => {
    let value = null
    if (isBuffer(mnemonic)) {
      value = mnemonic.toString()
    } else {
      value = mnemonic
    }

    const seed = bip39.mnemonicToSeedSync(value.trim())
    return new Wallet(seed)
  },
  fromSeed: (seed) => {
    return new Wallet(seed)
  },
  DefaultHDPath: 'm/44\'/60\'/0\'/0'
}

if (typeof window !== 'undefined') {
  window.HDWallet = HDWallet
}

module.exports = HDWallet
