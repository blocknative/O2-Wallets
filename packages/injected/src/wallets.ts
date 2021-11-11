import { delay } from './helpers'
import {
  CustomWindow,
  EIP1193Provider,
  InjectedNameSpace,
  InjectedWalletModule
} from '@o2/types'
import { ProviderIdentityFlag, ProviderLabel } from '@o2/types'
import Bowser from 'bowser'
import { createEIP1193Provider } from '@o2/common'

declare const window: CustomWindow

const metamask: InjectedWalletModule = {
  label: ProviderLabel.MetaMask,
  injectedNamespace: InjectedNameSpace.Ethereum,
  checkProviderIdentity: provider =>
    !!provider?.[ProviderIdentityFlag.MetaMask],
  getIcon: async () => (await import('./icons/metamask')).default,
  getInterface: async () => ({
    provider: window.ethereum as EIP1193Provider
  }),
  platforms: ['all']
}

const binance: InjectedWalletModule = {
  label: ProviderLabel.Binance,
  injectedNamespace: InjectedNameSpace.Binance,
  checkProviderIdentity: provider => !!provider?.[ProviderIdentityFlag.Binance],
  getIcon: async () => (await import('./icons/binance')).default,
  getInterface: async () => {
    // We add this to the BinanceChain provider as there is currently
    // no way to determine if the wallet is unlocked
    if (window?.BinanceChain) {
      window.BinanceChain.isUnlocked = false
    }

    const provider = createEIP1193Provider(window.BinanceChain, {
      // If the wallet is unlocked then we don't need to patch this request
      ...(!window.BinanceChain.isUnlocked && {
        eth_accounts: () => Promise.resolve([])
      }),
      eth_requestAccounts: request =>
        request({ method: 'eth_requestAccounts' }).then(accts => {
          window.BinanceChain.isUnlocked = true
          return accts
        }),
      eth_chainId: request =>
        request({ method: 'eth_chainId' }).then(
          id => `0x${parseInt(id).toString(16)}`
        ),
      // Unsupported method -- will throw error
      wallet_switchEthereumChain: null
    })

    provider.off = (event, func) => {}

    return {
      provider
    }
  },
  platforms: ['desktop']
}

const coinbase: InjectedWalletModule = {
  label: ProviderLabel.Coinbase,
  injectedNamespace: InjectedNameSpace.Ethereum,
  checkProviderIdentity: provider =>
    !!provider?.[ProviderIdentityFlag.Coinbase],
  getIcon: async () => (await import('./icons/coinbase')).default,
  getInterface: async () => {
    const provider = window.ethereum as EIP1193Provider
    const addListener = provider.on.bind(provider)
    provider.addListener = (event, func) => {
      if (event === 'chainChanged') {
        addListener(event, chainId => {
          // @ts-ignore
          func(`0x${parseInt(chainId).toString(16)}`)
        })
      }
    }

    return { provider }
  },
  platforms: ['all']
}

const detected: InjectedWalletModule = {
  label: ProviderLabel.Detected,
  injectedNamespace: InjectedNameSpace.Ethereum,
  checkProviderIdentity: provider =>
    !!provider?.[ProviderIdentityFlag.Detected],
  getIcon: async () => (await import('./icons/detected')).default,
  getInterface: async () => ({
    provider: window.ethereum as EIP1193Provider
  }),
  platforms: ['all']
}

const trust: InjectedWalletModule = {
  label: ProviderLabel.Trust,
  injectedNamespace: InjectedNameSpace.Ethereum,
  checkProviderIdentity: provider => !!provider?.[ProviderIdentityFlag.Trust],
  getIcon: async () => (await import('./icons/trust')).default,
  getInterface: async () => ({
    provider: window.ethereum as EIP1193Provider
  }),
  platforms: ['mobile']
}

const opera: InjectedWalletModule = {
  label: ProviderLabel.Opera,
  injectedNamespace: InjectedNameSpace.Ethereum,
  checkProviderIdentity: () =>
    Bowser.getParser(window.navigator.userAgent).getBrowserName() === 'Opera',
  getIcon: async () => (await import('./icons/opera')).default,
  getInterface: async () => ({
    provider: createEIP1193Provider(window.ethereum, {
      eth_requestAccounts: async request => request({ method: 'eth_accounts' })
    })
  }),
  platforms: ['all']
}

const status: InjectedWalletModule = {
  label: ProviderLabel.Status,
  injectedNamespace: InjectedNameSpace.Ethereum,
  checkProviderIdentity: provider => !!provider?.[ProviderIdentityFlag.Status],
  getIcon: async () => (await import('./icons/status')).default,
  getInterface: async () => ({
    provider: window.ethereum as EIP1193Provider
  }),
  platforms: ['mobile']
}

const wallets = [metamask, binance, coinbase, detected, trust, opera, status]

export default wallets
