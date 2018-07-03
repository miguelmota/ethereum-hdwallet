# ethereum-hdwallet

> Ethereum HD Wallet derivations from mnemonic

## Install

```bash
npm install ethereum-hdwallet
```

## Getting Started

```js
const HDWallet = require('ethereum-hdwallet')

const mnemonic = 'tag volcano eight thank tide danger coast health above argue embrace heavy'
const hdwallet = new HDWallet(mnemonic)
console.log(hdwallet.hdpath()) // m/44'/60'/0'/0/
```

Deriving wallets given account index

```js
const hdwallet = new HDWallet(mnemonic)

console.log('0x' + hdwallet.derive(0).getAddress().toString('hex')) // 0xc49926c4124cee1cba0ea94ea31a6c12318df947
console.log(hdwallet.derive(0).getPrivateKey().toString('hex')) // 63e21d10fd50155dbba0e7d3f7431a400b84b4c2ac1ee38872f82448fe3ecfb9

console.log('0x' + hdwallet.derive(1).getAddress().toString('hex')) // 0x8230645ac28a4edd1b0b53e7cd8019744e9dd559
console.log('0x' + hdwallet.derive(2).getAddress().toString('hex')) // 0x65c150b7ef3b1adbb9cb2b8041c892b15edde05a
console.log('0x' + hdwallet.derive(2).getAddress().toString('hex')) // 0x1aebbe69459b80d4975259378577bc01d2924cf4
```

Signing transaction:

```js
const signedRawTx = hdwallet.derive(0).signTransaction({
  to: '0x0000000000000000000000000000000000000000',
  value: '0x0',
  data: '0x0'
})

console.log(signedTx.toString('hex')) // 0xf85d80808094000000000000000000000000000000000000000080001ca0de4b34f17bf51d0b783082090c10d133dcc867c7e981c07cda5ddd1e3211f44ca02125dff6879141708899838356bc42df8815220069ce10507ae4ea980791dac4
```

The default HD path is `m/44'/60'/0'/0/` but you may pass a custom path to the constructor:

```js
const hdwallet = new HDWallet(mnemonic, hdpath);
console.log(hdwallet.hdpath()) // m/44'/100'/0'/0/
```

## Test

```bash
npm test
```

## License

MIT
