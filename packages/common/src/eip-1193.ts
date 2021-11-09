import {
  AccountsListener,
  ChainId,
  ChainListener,
  ConnectListener,
  DisconnectListener,
  EIP1193Provider,
  MessageListener,
  ProviderAccounts,
  ProviderInfo,
  ProviderLabel,
  ProviderMessage,
  SimpleEventEmitter
} from '@o2/types'
import { EventCallback, RequestPatch } from './types'
import { ProviderRpcError } from './errors'

/**
 * Takes a provider instance along with events and requests to override and returns an EIP1193 provider
 *
 *  ## Example:
 *
 * *Overriding events: *
 * ```typescript
 * ```
 *
 * @param provider The provider to patch
 * @param requestPatch An `object` with the method to patch and the implementation with which to patch
 * @param events Events to patch
 * @returns An EIP1193 Provider
 */
export const createEIP1193Provider = (
  provider: any,
  requestPatch?: RequestPatch,
  events?: Record<
    keyof SimpleEventEmitter,
    EventCallback | EIP1193Provider['on']
  >
): EIP1193Provider => {
  if (provider.patched) {
    return provider
  } else {
    provider.patched = true
  }

  // Copy the original request method and bind the provider context to it
  const originalRequest = provider.request.bind(provider)

  const request: EIP1193Provider['request'] = ({ method, params }) => {
    // If the request method is set to null this indicates this method is not supported
    if (requestPatch?.[method] === null) {
      throw new ProviderRpcError({
        code: 4200,
        message: `The Provider does not support the requested method: ${method}`
      })
    }

    if (requestPatch?.[method]) {
      if (params !== undefined) {
        return requestPatch[method]?.(originalRequest, params)
      } else {
        // @ts-ignore
        return requestPatch[method]?.(originalRequest)
      }
    } else {
      return originalRequest?.({ method, params })
    }
  }

  provider.request = request

  return provider
}
