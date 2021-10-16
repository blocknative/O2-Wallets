import { getProvider, getInfo as _getInfo, getProviderName } from './helpers'
import {
  Platform,
  WalletInfo,
  WalletInterface,
  WalletInterfaceHelpers,
  WalletModule,
  InjectedWalletOptions,
  WalletOptions,
  ProviderName
} from './types'

export default class InjectedWallet implements WalletModule {
  platforms: Platform[] = ['OSX', 'android', 'iOS', 'windows', 'linux']
  provider = getProvider()
  walletOptions?: WalletOptions
  private providerName: ProviderName | null

  // No wallet detected, or the wallet that is detected the developer has disabled
  private disabled: boolean = false

  private walletInfo: Promise<WalletInfo> | null = null
  constructor(options?: InjectedWalletOptions) {
    this.providerName = this.provider ? getProviderName(this.provider) : null

    if (this.providerName) {
      const walletOption = options?.wallets?.[this.providerName]
      this.walletInfo = _getInfo(this.providerName).then(
        (info: WalletInfo) => ({
          ...info,
          ...walletOption
        })
      )
    }
  }

  async getInterface<T>(
    helpers: WalletInterfaceHelpers
  ): Promise<WalletInterface<T> | null> {
    if (this.provider) return null
    return null
  }

  async getInfo(): Promise<WalletInfo | null> {
    return this.walletInfo
  }
}
