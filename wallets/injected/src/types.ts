import type {
  JsonRpcProvider,
  Web3Provider,
  ExternalProvider
} from '@ethersproject/providers'
import type { Observable } from 'rxjs'

export interface WalletModule {
  getInfo: () => Promise<WalletInfo | null>
  getInterface: <T>(
    helpers: WalletInterfaceHelpers
  ) => Promise<WalletInterface<T> | null>
  platforms: Platform[]
}

export type ProviderName = 'metamask' | 'detected'

export type WalletOptions = {
  [key in ProviderName]: Partial<WalletInfo>
}

export interface WalletExclusions {
  desktop?: boolean
  mobile?: boolean
}

export interface InjectedWalletOptions {
  wallets?: WalletOptions[]
  exclude?: WalletExclusions[]
}

export type WalletInfo = {
  // The display name of the wallet
  name: string
  // The wallet icon
  icon: string
}

export type Platform = 'iOS' | 'android' | 'OSX' | 'linux' | 'windows'

export interface WalletInterface<T> {
  web3Provider: Web3Provider // ethers initialized provider
  instance?: T // instance for sdk wallets
}

export interface WalletInterfaceHelpers {
  Web3Provider: Web3Provider // ethers web3 provider class
  JsonRpcProvider: JsonRpcProvider // ethers JsonRpc provider class
  // subscribe to this and do cleanup logic upon emit (ie remove listeners)
  disconnectWallet$: Observable<boolean>
}

export interface MeetOneProvider extends ExternalProvider {
  wallet?: string
}

export interface BinanceProvider extends ExternalProvider {
  bbcSignTx: () => void
}

export interface CustomWindow extends Window {
  BinanceChain: BinanceProvider
  ethereum: ExternalProvider | MeetOneProvider
  web3: ExternalProvider | MeetOneProvider
}

export type InjectedProvider =
  | BinanceProvider
  | MeetOneProvider
  | ExternalProvider
