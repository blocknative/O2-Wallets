import standardWallets from './wallets'
import uniqBy from 'lodash.uniqby'
import {
  WalletInit,
  InjectedWalletOptions,
  CustomWindow,
  ProviderLabel
} from '@o2/types'
import { remove } from './helpers'
import { validateWalletOptions } from './validation'

declare const window: CustomWindow

export function injected(options: InjectedWalletOptions): WalletInit {
  validateWalletOptions(options)

  return helpers => {
    const { device } = helpers
    const { wallets = [], exclude = {} } = options || {}
    const allWallets = [...wallets, ...standardWallets]
    const deduped = uniqBy(allWallets, ({ label }) => `${label}`)

    const walletsWithSupportedFlag = deduped.map(wallet => {
      const { label, platforms } = wallet
      const walletExclusions = exclude[label]

      const excludedWallet = walletExclusions === false

      const excludedDevice =
        typeof walletExclusions === 'object' &&
        (walletExclusions?.includes(device.type) ||
          walletExclusions.includes(device.os.name))

      const invalidPlatform =
        !platforms.includes('all') &&
        !platforms.includes(device.type) &&
        !platforms.includes(device.os.name)

      const supportedWallet =
        !excludedWallet && !excludedDevice && !invalidPlatform

      return {
        ...wallet,
        supported: !!supportedWallet
      }
    })

    let removeMetaMask = false

    const validWallets = walletsWithSupportedFlag.filter(
      ({ injectedNamespace, checkProviderIdentity, label }) => {
        const provider = window[injectedNamespace] as CustomWindow['ethereum']

        const walletExists = checkProviderIdentity(provider)

        if (
          walletExists &&
          provider.isMetaMask &&
          label !== ProviderLabel.MetaMask &&
          label !== 'Detected Wallet'
        ) {
          removeMetaMask = true
        }

        return walletExists
      }
    )

    if (validWallets.length) {
      const moreThanOneWallet = validWallets.length > 1
      // if more than one wallet, then remove detected wallet
      return validWallets
        .filter(
          remove({
            detected: moreThanOneWallet,
            metamask: moreThanOneWallet && removeMetaMask
          })
        )
        .map(({ label, getIcon, getInterface, supported }) => ({
          label,
          getIcon,
          getInterface,
          supported,
          type: 'injected'
        }))
    }

    return []
  }
}
