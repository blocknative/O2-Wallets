import {
  Balance,
  ChainId,
  EIP1193Provider,
  ProviderAccounts,
  ProviderInfo,
  ProviderMessage,
  ProviderRpcError
} from '@o2/types'

/**
 * Types for request patching methods. Ethereum RPC request is mapped to
 * the implementation that will replace the original.
 * If a method is not supported set it to `null` and the appropriate error will get called.
 */
export type RequestPatch = {
  eth_accounts?:
    | ((request: EIP1193Provider['request']) => Promise<ProviderAccounts>)
    | null
  eth_getBalance?:
    | ((
        request: EIP1193Provider['request'],
        params: [string, (number | 'latest' | 'earliest' | 'pending')?]
      ) => Promise<Balance>)
    | null
  eth_requestAccounts?:
    | ((request: EIP1193Provider['request']) => Promise<ProviderAccounts>)
    | null
  eth_chainId?:
    | ((request: EIP1193Provider['request']) => Promise<string>)
    | null
  wallet_switchEthereumChain?:
    | ((request: EIP1193Provider['request']) => Promise<null>)
    | null
}

export interface EventCallback {
  connect?: <T = ProviderInfo>(info: T) => ProviderInfo
  disconnect?: <T = ProviderRpcError>(error: T) => ProviderRpcError
  message?: <T = ProviderMessage>(message: T) => ProviderMessage
  chainChanged?: <T = ChainId>(chainId: T) => ChainId
  accountsChanged?: <T = ProviderAccounts>(accounts: T) => ProviderAccounts
}
