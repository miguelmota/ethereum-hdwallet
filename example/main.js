const $form = document.querySelector('#form')
const $mnemonic = document.querySelector('#mnemonic')
const $hdpath = document.querySelector('#hdpath')
const $output = document.querySelector('#output')
const $indexStart = document.querySelector('#indexStart')
const $indexEnd = document.querySelector('#indexEnd')

$form.addEventListener('submit', (event) => {
  event.preventDefault()
  generateKeys()
})

function generateKeys () {
  try {
    $output.innerHTML = ''
    const mnemonic = $mnemonic.value
    if (!mnemonic) {
      throw new Error('mnemonic is required')
    }
    const hdpath = $hdpath.value || window.HDWallet.DefaultHDPath
    const hdwallet = window.HDWallet.fromMnemonic(mnemonic).derive(hdpath)
    const start = Number($indexStart.value) || 0
    const end = Number($indexEnd.value) || 10
    let result = '<tr><th>hdpath</th><th>address</th><th>privateKey</th><th>publicKey</th></tr>'
    for (let i = start; i <= end; i++) {
      const wallet = hdwallet.derive(i)
      const hdpath = `${wallet.hdpath()}`
      const address = `0x${wallet.getAddress().toString('hex')}`
      const privateKey = `${wallet.getPrivateKey().toString('hex')}`
      const publicKey = `${wallet.getPublicKey().toString('hex')}`
      result += `<tr><td>${hdpath}</td><td>${address}</td><td>${privateKey}</td><td>${publicKey}</td></tr>`
    }
    $output.innerHTML = `<table>${result}</table>`
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}
