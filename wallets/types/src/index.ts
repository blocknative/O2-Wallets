import type { ExternalProvider } from '@ethersproject/providers'

export type WalletInit = (
  helpers: WalletHelpers
) => WalletModule | WalletModule[]

export type WalletHelpers = {
  device: Device
}

export type ProviderName = 'metamask' | 'detected'

export type WalletInfo = {
  // The display name of the wallet
  name: string
  // The wallet icon
  icon: string
}

export type WalletOptions = {
  [key in ProviderName]?: Partial<WalletInfo>
}

export interface ExcludedPlatforms {
  desktop?: boolean
  mobile?: boolean
}

export type WalletExclusions = {
  [key in ProviderLabel | string]?: Platform[] | boolean
}

export interface InjectedWalletOptions {
  wallets?: InjectedWalletModule[]
  exclude?: WalletExclusions
}

export type Device = {
  os: DeviceOS
  type: DeviceType
  browser: DeviceBrowser
}
export interface WalletModule {
  // The label of the wallet
  label: ProviderLabel | string
  /**
   * Gets the icon of the wallet
   * @returns
   */
  getIcon: () => Promise<string>
  /**
   * @returns the wallet interface associated with the module
   */
  getInterface: () => Promise<WalletInterface>
}
export interface InjectedWalletModule extends WalletModule {
  injectedNamespace: InjectedNameSpace
  providerIdentityFlag: ProviderIdentityFlag | string
  platforms: Platform[]
}

export interface HardwareWalletModule extends WalletModule {
  rpc: RPC
}

export type RPC = {
  [key: ChainId]: RpcUrl
}

export type Platform = DeviceOSName | DeviceBrowserName | DeviceType | 'all'

export type DeviceOS = {
  name: DeviceOSName
  version: string
}

export type DeviceBrowser = {
  name: DeviceBrowserName
  version: string
}

export type DeviceOSName =
  | 'Windows Phone'
  | 'Windows'
  | 'macOS'
  | 'iOS'
  | 'Android'
  | 'Linux'
  | 'Chrome OS'

export type DeviceBrowserName =
  | 'Android Browser'
  | 'Chrome'
  | 'Chromium'
  | 'Firefox'
  | 'Microsoft Edge'
  | 'Opera'
  | 'Safari'

export type DeviceType = 'desktop' | 'mobile' | 'tablet'

export type ChainId = string

export type RpcUrl = string

export type WalletInterface = {
  provider: EIP1193Provider
}
export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}
export interface ProviderMessage {
  type: string
  data: unknown
}
export interface ProviderInfo {
  chainId: ChainId
}
/**
 *  The account address
 */
export type Account = string

/**
 * An array of addresses
 */
export type ProviderAccounts = Account[]

export type RPCRequestMethod =
  | 'eth_accounts'
  | 'eth_call'
  | 'eth_getBalance'
  | 'eth_sendTransaction'
  | 'eth_sign'
  | 'eth_requestAccounts'
  | 'wallet_addEthereumChain'
  | 'wallet_switchEthereumChain'

export type ProviderEvent =
  | 'connect'
  | 'disconnect'
  | 'message'
  | 'chainChanged'
  | 'accountsChanged'

export interface SimpleEventEmitter {
  on(
    event: ProviderEvent,
    listener:
      | ConnectListener
      | DisconnectListener
      | MessageListener
      | ChainListener
      | AccountsListener
  ): void
  once(
    event: ProviderEvent,
    listener:
      | ConnectListener
      | DisconnectListener
      | MessageListener
      | ChainListener
      | AccountsListener
  ): void
  removeListener(
    event: ProviderEvent,
    listener:
      | ConnectListener
      | DisconnectListener
      | MessageListener
      | ChainListener
      | AccountsListener
  ): void
  off(
    event: ProviderEvent,
    listener:
      | ConnectListener
      | DisconnectListener
      | MessageListener
      | ChainListener
      | AccountsListener
  ): void
}


export type ConnectListener = (info: ProviderInfo) => void
export type DisconnectListener = (error: ProviderRpcError) => void
export type MessageListener = (message: ProviderMessage) => void
export type ChainListener = (chainId: ChainId) => void
export type AccountsListener = (accounts: ProviderAccounts) => void

/**
 * The hexadecimal representation of the users
 */
export type Balance = string

type BaseRequest = { params?: never }

export interface EthAccountsRequest extends BaseRequest {
  method: 'eth_accounts'
}

export interface EthChainIdRequest extends BaseRequest {
  method: 'eth_chainId'
}

export interface EthBalanceRequest {
  method: 'eth_getBalance'
  params: [string, (number | 'latest' | 'earliest' | 'pending')?]
}

export interface RequestArguments {
  method: RPCRequestMethod
  params?: never
}

export interface EIP1102Request extends RequestArguments {
  method: 'eth_requestAccounts'
}

export interface EIP3085Request extends RequestArguments {
  method: 'wallet_addEthereumChain'
}

export interface EIP3326Request extends RequestArguments {
  method: 'wallet_switchEthereumChain'
}

export interface EIP1193Provider extends SimpleEventEmitter {
  on(event: 'connect', listener: ConnectListener): void
  on(event: 'disconnect', listener: DisconnectListener): void
  on(event: 'message', listener: MessageListener): void
  on(event: 'chainChanged', listener: ChainListener): void
  on(event: 'accountsChanged', listener: AccountsListener): void
  // request(args: RequestArguments): Promise<unknown>
  request(args: EthAccountsRequest): Promise<ProviderAccounts>
  request(args: EthBalanceRequest): Promise<Balance>
  request(args: EIP1102Request): Promise<ProviderAccounts>
  request(args: EIP3326Request): Promise<null>
  request(args: EthChainIdRequest): Promise<string>
}

export interface MeetOneProvider extends ExternalProvider {
  wallet?: string
}

export interface BinanceProvider extends EIP1193Provider {
  bbcSignTx: () => void
  requestAccounts: () => Promise<ProviderAccounts>
  isUnlocked: boolean
}

export enum InjectedNameSpace {
  Ethereum = 'ethereum',
  Binance = 'BinanceChain',
  Web3 = 'web3'
}

export interface CustomWindow extends Window {
  BinanceChain: BinanceProvider
  ethereum: InjectedProvider
  web3: ExternalProvider | MeetOneProvider
}

export type InjectedProvider = ExternalProvider &
  BinanceProvider &
  MeetOneProvider &
  ExternalProvider &
  Record<string, boolean>

/**
 * The `ProviderIdentityFlag` is a property on an injected provider
 * that uniquely identifies that provider
 */
export enum ProviderIdentityFlag {
  Binance = 'bbcSignTx',
  MetaMask = 'isMetaMask',
  Coinbase = 'isWalletLink',
  Detected = 'request'
}

export enum ProviderLabel {
  Binance = 'Binance Smart Wallet',
  MetaMask = 'MetaMask',
  Coinbase = 'Coinbase Wallet',
  Detected = 'Detected Wallet'
}

export enum ProviderRpcErrorCode {
  /** The user rejected the request. */
  RejectedRequest = '4001',

  /** The requested method and/or account has not been authorized by the user. */
  Unauthorized = '4100',

  /** The Provider does not support the requested method. */
  UnsupportedMethod = '4200',

  /** The Provider is disconnected from all chains. */
  Disconnected = '4900',

  /** The Provider is not connected to the requested chain. */
  ChainDisconnected = '4901'
}
