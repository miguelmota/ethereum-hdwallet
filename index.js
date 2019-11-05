const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')
const Transaction = require('ethereumjs-tx')

class Wallet {
  constructor(seed, hdpath='') {
    this.__hdwallet = hdkey.fromMasterSeed(seed)
    this.__hdpath = hdpath
  }

  hdpath() {
    return this.__hdpath
  }

  getAddress() {
    return this.__hdwallet.derivePath(this.__hdpath).getWallet().getAddress()
  }

  getPublicKey() {
    return this.__hdwallet.derivePath(this.__hdpath).getWallet().getPublicKey()
  }

  getPrivateKey() {
    return this.__hdwallet.derivePath(this.__hdpath).getWallet().getPrivateKey()
  }

  signTransaction(txParams) {
    const wallet = this.__hdwallet.derivePath(this.__hdpath).getWallet()
    txParams.from = txParams.from || '0x' + wallet.getAddress().toString('hex')
    const tx = new Transaction(txParams)
    const priv = wallet.getPrivateKey()
    tx.sign(priv)
    return tx.serialize()
  }

  derive(hdpath) {
    if (typeof hdpath === undefined) return this
    const clone = Object.assign( Object.create( Object.getPrototypeOf(this)), this)
    if (/^[0-9]+'?$/.test(hdpath)) {
      hdpath = `/${hdpath}`
    }
    clone.__hdpath = this.__hdpath + hdpath
    return clone
  }
}

const HDWallet = {
  fromMnemonic: mnemonic => {
    const seed = bip39.mnemonicToSeed(mnemonic)
    return new Wallet(seed)
  },
  fromSeed: seed => {
    return new Wallet(seed)
  },
  DefaultHDPath: `m/44'/60'/0'/0`
}

module.exports = HDWallet
