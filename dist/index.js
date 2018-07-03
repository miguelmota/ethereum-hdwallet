'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bip39 = require('bip39');
var hdkey = require('ethereumjs-wallet/hdkey');
var Transaction = require('ethereumjs-tx');

var HDWallet = function () {
  function HDWallet(mnemonic) {
    var hdpath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'm/44\'/60\'/0\'/0/';

    _classCallCheck(this, HDWallet);

    this._mnemonic = mnemonic;
    this._hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    this._hdpath = hdpath;
  }

  _createClass(HDWallet, [{
    key: 'hdpath',
    value: function hdpath() {
      return this._hdpath;
    }
  }, {
    key: 'mnemonic',
    value: function mnemonic() {
      return this._mnemonic;
    }
  }, {
    key: 'derive',
    value: function derive(idx) {
      var wallet = this._hdwallet.derivePath(this._hdpath + idx).getWallet();
      wallet.signTransaction = function (txParams) {
        txParams.from = txParams.from || '0x' + wallet.getAddress().toString('hex');
        var tx = new Transaction(txParams);
        var priv = wallet.getPrivateKey();
        tx.sign(priv);
        return tx.serialize();
      };

      return wallet;
    }
  }]);

  return HDWallet;
}();

module.exports = HDWallet;