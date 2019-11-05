'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bip39 = require('bip39');
var hdkey = require('ethereumjs-wallet/hdkey');
var Transaction = require('ethereumjs-tx');

var Wallet = function () {
  function Wallet(seed) {
    var hdpath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, Wallet);

    this.__hdwallet = hdkey.fromMasterSeed(seed);
    this.__hdpath = hdpath;
  }

  _createClass(Wallet, [{
    key: 'hdpath',
    value: function hdpath() {
      return this.__hdpath;
    }
  }, {
    key: 'getAddress',
    value: function getAddress() {
      return this.__hdwallet.derivePath(this.__hdpath).getWallet().getAddress();
    }
  }, {
    key: 'getPublicKey',
    value: function getPublicKey() {
      return this.__hdwallet.derivePath(this.__hdpath).getWallet().getPublicKey();
    }
  }, {
    key: 'getPrivateKey',
    value: function getPrivateKey() {
      return this.__hdwallet.derivePath(this.__hdpath).getWallet().getPrivateKey();
    }
  }, {
    key: 'signTransaction',
    value: function signTransaction(txParams) {
      var wallet = this.__hdwallet.derivePath(this.__hdpath).getWallet();
      txParams.from = txParams.from || '0x' + wallet.getAddress().toString('hex');
      var tx = new Transaction(txParams);
      var priv = wallet.getPrivateKey();
      tx.sign(priv);
      return tx.serialize();
    }
  }, {
    key: 'derive',
    value: function derive(hdpath) {
      if ((typeof hdpath === 'undefined' ? 'undefined' : _typeof(hdpath)) === undefined) return this;
      var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
      if (/^[0-9]+'?$/.test(hdpath)) {
        hdpath = '/' + hdpath;
      }
      clone.__hdpath = this.__hdpath + hdpath;
      return clone;
    }
  }]);

  return Wallet;
}();

var HDWallet = {
  fromMnemonic: function fromMnemonic(mnemonic) {
    var seed = bip39.mnemonicToSeed(mnemonic);
    return new Wallet(seed);
  },
  fromSeed: function fromSeed(seed) {
    return new Wallet(seed);
  },
  DefaultHDPath: 'm/44\'/60\'/0\'/0'
};

module.exports = HDWallet;