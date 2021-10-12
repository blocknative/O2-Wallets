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

const mergeWallets = () => {}

export default class InjectedWallet implements WalletModule {
  platforms: Platform[] = ['OSX', 'android', 'iOS', 'windows', 'linux']
  provider = getProvider()
  walletOptions?: WalletOptions
  private providerName: ProviderName | null
  private disabled: boolean = false
  constructor(options?: InjectedWalletOptions) {
    this.walletOptions = options?.wallets
    this.providerName = this.provider ? getProviderName(this.provider) : null
    const walletOption = this.walletOptions[this.providerName]
    this.disabled =
      !this.providerName || (this.providerName && walletOption === false)
  }

  async getInterface<T>(
    helpers: WalletInterfaceHelpers
  ): Promise<WalletInterface<T> | null> {
    if (this.provider) return null
    return null
  }

  async getInfo(): Promise<WalletInfo | null> {
    if (!this.providerName) return null
    let info = await _getInfo(this.providerName)
    if (info) {
      this.wallets?.[this.providerName]
    }
    return info
  }
}
