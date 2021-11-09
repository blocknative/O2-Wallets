import { delay } from './helpers'
import {
  CustomWindow,
  EIP1193Provider,
  InjectedNameSpace,
  InjectedWalletModule
} from '@o2/types'
import { ProviderIdentityFlag, ProviderLabel } from '@o2/types'

import { createEIP1193Provider } from '@o2/common'

declare const window: CustomWindow

const metamask: InjectedWalletModule = {
  label: ProviderLabel.MetaMask,
  injectedNamespace: InjectedNameSpace.Ethereum,
  providerIdentityFlag: ProviderIdentityFlag.MetaMask,
  getIcon: async () =>
    delay(1000).then(async () => (await import('./icons/metamask')).default),
  getInterface: async () => ({
    provider: window.ethereum as EIP1193Provider
  }),
  platforms: ['all']
}

const binance = {
  label: ProviderLabel.Binance,
  injectedNamespace: InjectedNameSpace.Binance,
  providerIdentityFlag: ProviderIdentityFlag.Binance,
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
      eth_chainId: async request =>
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
  providerIdentityFlag: ProviderIdentityFlag.Coinbase,
  getIcon: async () => (await import('./icons/coinbase')).default,
  getInterface: async () => {
    const provider = window.ethereum as EIP1193Provider
    const addListener = provider.on.bind(provider)
    provider.addListener = (event, func) => {
      if (event === 'chainChanged') {
        addListener(event, chainId => {
          if (chainId === 'string') {
            // @ts-ignore
            func(`0x${parseInt(chainId).toString(16)}`)
          }
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
  providerIdentityFlag: ProviderIdentityFlag.Detected,
  getIcon: async () =>
    delay(1203).then(async () => (await import('./icons/detected')).default),
  getInterface: async () => ({
    provider: window.ethereum as EIP1193Provider
  }),
  platforms: ['all']
}

const trust: InjectedWalletModule = {
  label: ProviderLabel.Trust,
  injectedNamespace: InjectedNameSpace.Ethereum,
  providerIdentityFlag: ProviderIdentityFlag.Trust,
  getIcon: async () => (await import('./icons/trust')).default,
  getInterface: async () => ({
    provider: window.ethereum as EIP1193Provider
  }),
  platforms: ['mobile']
}

const wallets = [metamask, binance, coinbase, detected, trust]

export default wallets
