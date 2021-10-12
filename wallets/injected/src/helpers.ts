import type {
  CustomWindow,
  InjectedProvider,
  WalletInfo,
  MeetOneProvider,
  BinanceProvider,
  ProviderName
} from './types'

import { WALLET_NAMES } from './constants'

declare const window: CustomWindow

/**
 * Gets the provider from the window object.
 * @returns The provider from the window object.
 */
export const getProvider = (): InjectedProvider | null => {
  if (window.BinanceChain) {
    return window.BinanceChain
  }

  if (window.ethereum) {
    return window.ethereum
  }
  return null
}

/**
 * Given a provider return its name and icon.
 * @param provider - The injected provider
 * @returns The name and icon associated with the injected provider
 */
export const getInfo = async (providerName: string): Promise<WalletInfo> => {
  return {
    name: WALLET_NAMES[providerName],
    icon: (await import(`./icons/${providerName}`)).default
  }
}

/**
 * Uses the `is` property of the provider object to get the provider name.
 * It defaults to `detected` if we can't find a name for the provider.
 * @param provider - The injected provider
 * @returns The name of the provider or `detected` if provider name could not be found.
 */
export const getProviderName = (provider: InjectedProvider): ProviderName => {
  let providerName =
    Object.keys(provider)
      .find(key => key.startsWith('is'))
      ?.split('is')[1]
      ?.toLocaleLowerCase() || ''

  if ((provider as MeetOneProvider)?.wallet === 'MEETONE') {
    providerName = 'meetone'
  } else if ((provider as BinanceProvider)?.bbcSignTx) {
    providerName = 'binance'
  }

  providerName = providerName in WALLET_NAMES ? providerName : 'detected'

  // Check to see if the provider name is in list of known wallet names
  // If not we consider it to be an unknown detected wallet
  return providerName as ProviderName
}
