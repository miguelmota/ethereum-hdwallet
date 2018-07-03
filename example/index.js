const HDWallet = require('ethereum-hdwallet')
const mnemonic = 'tag volcano eight thank tide danger coast health above argue embrace heavy'

const hdwallet = new HDWallet(mnemonic)

console.log(hdwallet.hdpath())

console.log('0x' + hdwallet.derive(0).getAddress().toString('hex'))
console.log(hdwallet.derive(0).getPrivateKey().toString('hex'))

console.log('0x' + hdwallet.derive(1).getAddress().toString('hex'))
console.log('0x' + hdwallet.derive(2).getAddress().toString('hex'))
console.log('0x' + hdwallet.derive(3).getAddress().toString('hex'))

const signedRawTx = hdwallet.derive(0).signTransaction({
  to: '0x0000000000000000000000000000000000000000',
  value: '0x0',
  data: '0x0'
})
console.log(signedRawTx.toString('hex'))
