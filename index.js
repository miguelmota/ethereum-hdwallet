var bip39 = require('bip39')
var hdkey = require('ethereumjs-wallet/hdkey')
var Transaction = require('ethereumjs-tx')

class HDWallet {
  constructor(mnemonic, hdpath=`m/44'/60'/0'/0/`) {
    this._mnemonic = mnemonic
    this._hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
    this._hdpath = hdpath
  }

  hdpath() {
    return this._hdpath
  }

  mnemonic() {
    return this._mnemonic
  }

  derive(idx) {
    const wallet = this._hdwallet.derivePath(this._hdpath + idx).getWallet()
    wallet.signTransaction = (txParams) => {
      txParams.from = txParams.from || '0x' + wallet.getAddress().toString('hex')
      const tx = new Transaction(txParams)
      const priv = wallet.getPrivateKey()
      tx.sign(priv)
      return tx.serialize()
    }
    wallet.hdpath = () => {
      return this._hdpath + idx
    }

    return wallet
  }
}

module.exports = HDWallet
