import test from 'ava'
import InjectedWallet from '../src/index'

test.before(t => {
  // Add the provider object to the window object
  global.window.ethereum = {}
})

test('InjectedWallet(): Can instantiate InjectedWallet', t => {
  const injectedWallet = new InjectedWallet()
  // If no errors thrown we pass the test
  t.pass()
})

test('InjectedWallet(wallets: { metamask: { name: WALLET_NAME } }: Can override wallet name', async t => {
  const WALLET_NAME = 'TEST'
  const injectedWallet = new InjectedWallet({
    wallets: { metamask: { name: WALLET_NAME } }
  })
  const info = await injectedWallet.getInfo()
  t.is(info?.name, WALLET_NAME)
})

test('InjectedWallet.getInfo(): Injected Wallet returns correct wallet info', async t => {
  global.window.ethereum.isMetaMask = true
  const injectedWallet = new InjectedWallet()
  const info = await injectedWallet.getInfo()
  t.is(info?.name, 'MetaMask')
})
