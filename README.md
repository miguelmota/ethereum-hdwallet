<h3 align="center">
  <br />
  <img src="https://user-images.githubusercontent.com/168240/51435542-37197780-1c2e-11e9-833e-a8d003759100.png" alt="logo" width="600" />
  <br />
  <br />
  <br />
</h3>

# ethereum-hdwallet

> CLI and Node.js library for Ethereum HD Wallet derivations from mnemonic

[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/miguelmota/ethereum-hdwallet/master/LICENSE)
[![Build Status](https://travis-ci.org/miguelmota/ethereum-hdwallet.svg?branch=master)](https://travis-ci.org/miguelmota/ethereum-hdwallet)
[![Coverage Status](https://coveralls.io/repos/github/miguelmota/ethereum-hdwallet/badge.svg?branch=master)](https://coveralls.io/github/miguelmota/ethereum-hdwallet?branch=master) [![dependencies Status](https://david-dm.org/miguelmota/ethereum-hdwallet/status.svg)](https://david-dm.org/miguelmota/ethereum-hdwallet)
[![NPM version](https://badge.fury.io/js/ethereum-hdwallet.svg)](http://badge.fury.io/js/ethereum-hdwallet)

## Install

```bash
npm install ethereum-hdwallet
```

## Getting started

Creating a new HD wallet from a mnemonic:

```js
const HDWallet = require('ethereum-hdwallet')

const mnemonic = 'tag volcano eight thank tide danger coast health above argue embrace heavy'
const hdwallet = HDWallet.fromMnemonic(mnemonic)
console.log(`0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex')}`) // 0xc49926c4124cee1cba0ea94ea31a6c12318df947
```

Creating a new HD wallet from a seed:

```js
const seed = Buffer.from('efea201152e37883bdabf10b28fdac9c146f80d2e161a544a7079d2ecc4e65948a0d74e47e924f26bf35aaee72b24eb210386bcb1deda70ded202a2b7d1a8c2e', 'hex')
const hdwallet= HDWallet.fromSeed(seed)
console.log(`0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex')}`) // 0xc49926c4124cee1cba0ea94ea31a6c12318df947
```

Deriving keys at a HD path:

```js
console.log(hdwallet.derive(`m/44'/60'/0'/0/0`).getPublicKey().toString('hex')) // 6005c86a6718f66221713a77073c41291cc3abbfcd03aa4955e9b2b50dbf7f9b6672dad0d46ade61e382f79888a73ea7899d9419becf1d6c9ec2087c1188fa18
console.log(hdwallet.derive(`m/44'/60'/0'/0/0`).getPrivateKey().toString('hex')) // 63e21d10fd50155dbba0e7d3f7431a400b84b4c2ac1ee38872f82448fe3ecfb9
console.log(`0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex')}`) // 0xc49926c4124cee1cba0ea94ea31a6c12318df947
```

Deriving wallets given account index:

```js
const hdwallet = HDWallet.fromMnemonic(mnemonic)
const mywallet = hdwallet.derive(`m/44'/60'/0'/0`)
console.log(`0x${mywallet.derive(1).getAddress().toString('hex')}`) // 0x8230645ac28a4edd1b0b53e7cd8019744e9dd559
console.log(`0x${mywallet.derive(2).getAddress().toString('hex')}`) // 0x65c150b7ef3b1adbb9cb2b8041c892b15edde05a
console.log(`0x${mywallet.derive(3).getAddress().toString('hex')}`) // 0x1aebbe69459b80d4975259378577bc01d2924cf4
console.log(`0x${mywallet.derive(3).hdpath()}`) // m/44'/60'/0'/0/3
```

Signing transaction with a wallet:

```js
const hdwallet = HDWallet.fromMnemonic(mnemonic)
const signedRawTx = hdwallet.derive(`m/44'/60'/0'/0/0`).signTransaction({
  to: '0x0000000000000000000000000000000000000000',
  value: '0x0',
  data: '0x0'
})

console.log(`0x${signedRawTx.toString('hex')}`) // 0xf85d80808094000000000000000000000000000000000000000080001ca0de4b34f17bf51d0b783082090c10d133dcc867c7e981c07cda5ddd1e3211f44ca02125dff6879141708899838356bc42df8815220069ce10507ae4ea980791dac4
```

## CLI

### Install

```bash
npm install ethereum-hdwallet -g
```

### Usage

```bash
$ ethereum_hdwallet --help

  Usage
$ ethereum_hdwallet [options]

  Options
    -i, --index Account Index (e.g. 4)
    -c, --columns Columns to display (e.g. address, publickey, privatekey, hdpath)
    -r, --range Account Index Range (e.g 1-100)
    -m, --mnemonic Mnemonic
    -s, --seed Seed in hex format
    -p, --hdpath HD Path

  Examples
    $ ethereum_hdwallet -m "tag volcano eight thank tide danger coast health ab
ove argue embrace heavy" -r 0-10
```

The default HD path is `m/44'/60'/0'/0/`.

### Examples

Display the address at a particular account index:

```bash
$ ethereum_hdwallet -m "tag volcano eight thank tide danger coast health above argue embrace heavy" -i 4

account address
4       0x32f48bf54dbbfce73172e69fe563c130d536cd5f
```

Display the account address derived from a range of account indexes:

```bash
$ ethereum_hdwallet -m "tag volcano eight thank tide danger coast health above argue embrace heavy" -r 5-10

account address
5       0x1c255db352e8b3cc16efd721c61d7b1b5952b2bb
6       0x1a41029aeb54a8c09211539b92b2a3fd92ea8270
7       0x54c0897a1e281b107eee25d4f8eee5f6ae13f9d9
8       0x3d503e7c3799ab9478b6c04623275fdc0ad09b1e
9       0x2d69b45301b9b3e01c4797c7a48bbc7e7f9b355b
10      0x5e611cbdd26f78a4c837759378a7b41caa17b41b
```

Display the private keys of accounts:

```bash
$ ethereum_hdwallet -m "tag volcano eight thank tide danger coast health above argue embrace heavy" -r 5-10 -c privatekey

account private key
5       1a69b812ca32e38bcac5197a63f6c1a1fcb6ac202e524382565cef16f1b3c84c
6       83d5a75675cc8f1be09c7d4189117fe33ee3f09d1f9b5783140f03016a35b132
7       526db1890baf94e82162f17f25ad769eb7f981272d8d99c527ea1af443c2d0cc
8       cae7ce30e8e07507988d43ad8907edea2fd23f848fb1b8522dee53cac43a825f
9       7525a4c5f03fb0b22fd88862e23833d62719b609e32a9264f6e437d56520d375
10      9974334c5b8fc190302e93bc0e233709192f89fb2a7eeaf1d2f877cd3ae24262
```

Display the HD path of the account:

```bash
$ ethereum_hdwallet -m "tag volcano eight thank tide danger coast health above argue embrace heavy" -i 3 -c hdpath

account hd path
3       m/44'/60'/0'/0/3
```

Use a custom HD path:

```bash
$ ethereum_hdwallet -m "tag volcano eight thank tide danger coast health above argue embrace heavy" -p "m/44'/60'/20'/0/0" -r 0-3

account address
0       0xba59f66b853f1acb242bcc57ef188754fc79434b
1       0xbf4cfeb783b913c0ed1710f00e9ae1844d597c86
2       0x62b6ffac78674392e0c30ec042636e22907fbcd2
3       0xce8bf9293cf5c4e9ecb50aa8f9e42adf568ae356
```

Display multiple columns:

```bash
$ ethereum_hdwallet -m "tag volcano eight thank tide danger coast health above argue embrace heavy" -c address,hdpath -r 0-5

account address                                    hd path
0       0xc49926c4124cee1cba0ea94ea31a6c12318df947 m/44'/60'/0'/0/0
1       0x8230645ac28a4edd1b0b53e7cd8019744e9dd559 m/44'/60'/0'/0/1
2       0x65c150b7ef3b1adbb9cb2b8041c892b15edde05a m/44'/60'/0'/0/2
3       0x1aebbe69459b80d4975259378577bc01d2924cf4 m/44'/60'/0'/0/3
4       0x32f48bf54dbbfce73172e69fe563c130d536cd5f m/44'/60'/0'/0/4
5       0x1c255db352e8b3cc16efd721c61d7b1b5952b2bb m/44'/60'/0'/0/5
```

Pipe mnemonic:

```bash
$ echo "tag volcano eight thank tide danger coast health above argue embrace heavy" | ethereum_hdwallet -i 0

account address
0       0xc49926c4124cee1cba0ea94ea31a6c12318df947
```

## Test

```bash
npm test
```

## FAQ

- Q: How do I generate a random mnemonic?
  - A: Use the [bip39](https://github.com/bitcoinjs/bip39) library for generating mnemonics.

- Q: Why is the default HD path `44'/60'/0'/0`?
  - A: See [this EIP](https://github.com/ethereum/EIPs/issues/85).

## License

[MIT](LICENSE)
