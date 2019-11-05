const test = require('tape')
const HDWallet = require('../')

test('hdwallet', t => {
  t.plan(12)

  const mnemonic = 'tag volcano eight thank tide danger coast health above argue embrace heavy'
  const hdwallet = HDWallet.fromMnemonic(mnemonic)
  t.equal(hdwallet.hdpath(), '')
  t.equal(hdwallet.derive(`m/44'/60'/0'/0`).hdpath(), `m/44'/60'/0'/0`)
  t.equal(hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex'), 'c49926c4124cee1cba0ea94ea31a6c12318df947')
  t.equal(hdwallet.derive(`m/44'/60'/0'/0/0`).getPublicKey().toString('hex'), '6005c86a6718f66221713a77073c41291cc3abbfcd03aa4955e9b2b50dbf7f9b6672dad0d46ade61e382f79888a73ea7899d9419becf1d6c9ec2087c1188fa18')
  t.equal(hdwallet.derive(`m/44'/60'/0'/0/0`).getPrivateKey().toString('hex'), '63e21d10fd50155dbba0e7d3f7431a400b84b4c2ac1ee38872f82448fe3ecfb9')
  t.equal(hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex'), 'c49926c4124cee1cba0ea94ea31a6c12318df947')
  t.equal(hdwallet.derive(`m/44'/60'/0'/0`).derive().getAddress().toString('hex'), 'af1c991f6068ac832ec60a8557ef1c7d8b9bccd6')
  t.equal(hdwallet.derive(`m/44'/60'/0'/0`).derive(0).getAddress().toString('hex'), 'c49926c4124cee1cba0ea94ea31a6c12318df947')
  t.equal(hdwallet.derive(`m/44'/60'/0'/0`).derive(1).getAddress().toString('hex'), '8230645ac28a4edd1b0b53e7cd8019744e9dd559')
  t.equal(hdwallet.derive(`m/44'/60'/0'/0`).derive('1').getAddress().toString('hex'), '8230645ac28a4edd1b0b53e7cd8019744e9dd559')

  const signedRawTx = hdwallet.derive(`m/44'/60'/0'/0/0`).signTransaction({
    to: '0x0000000000000000000000000000000000000000',
    value: '0x0',
    data: '0x0'
  })

  t.equal(signedRawTx.toString('hex'), 'f85d80808094000000000000000000000000000000000000000080001ca0de4b34f17bf51d0b783082090c10d133dcc867c7e981c07cda5ddd1e3211f44ca02125dff6879141708899838356bc42df8815220069ce10507ae4ea980791dac4')

  const seed = Buffer.from('efea201152e37883bdabf10b28fdac9c146f80d2e161a544a7079d2ecc4e65948a0d74e47e924f26bf35aaee72b24eb210386bcb1deda70ded202a2b7d1a8c2e', 'hex')
  const hdwalletS = HDWallet.fromSeed(seed)
  t.equal(hdwalletS.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex'), 'c49926c4124cee1cba0ea94ea31a6c12318df947')
})
