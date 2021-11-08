# O2-Wallets

| Packages                                 | `@latest` Version | Size | Description                  |
| ---------------------------------------- | ----------------- | ---- | ---------------------------- |
| [@o2/injected-wallets][injected-wallets] | -                 | -    | Injected wallet modules      |
| [@o2/types][types-wallets]               | -                 | -    | Shared Typescript types      |
| [@o2/common][common-wallets]             | -                 | -    | Utils common to all packages |

# Contributing

## Adding new wallets

```bash
mkdir wallets/new-wallet
cd wallets/new-wallet
yarn init
```

### Adding shared deps

```
yarn add dep-name -W
```

<!----- Links ----->

[injected-wallets]: ./wallets/injected
[types-wallets]: ./wallets/types
[common-wallets]: ./wallets/common
