# O2-Wallets

| Packages                                 | `@latest` Version | Size | Description                  |
| ---------------------------------------- | ----------------- | ---- | ---------------------------- |
| [@o2/injected-wallets][injected-wallets] | -                 | -    | Injected wallet modules      |
| [@o2/types][types-wallets]               | -                 | -    | Shared Typescript types      |
| [@o2/common][common-wallets]             | -                 | -    | Utils common to all packages |

# Contributing

```

git clone git@github.com:blocknative/O2-Wallets.git
cd O2-Wallets
yarn

```

### Local integration

Using yarn link you can integrate these packages locally.

First run `yarn link` in each module:

```bash
$(cd packages/types; yarn link)
$(cd packages/common; yarn link)
$(cd packages/injected; yarn link)
```

Note: the `$()` syntax allows one to execute the command without changing the current directory

Next

Now that these packages are linked

```bash
cd your-app
yarn link @o2/injected-wallets
yarn link @o2/common
yarn link @o2/types
```

### Adding shared deps

Adding a “common” dependency to ALL packages

```bash
yarn add dep-name -W
```

### Adding a Local Sibling Dependency to a Specific Package:

```bash
lerna add sibling-dep --scope=dependant-package
```

Example:

```bash
lerna add @o2/types --scope=@o2/injected-wallets
```

```bash

```

<!----- Links ----->

[injected-wallets]: ./packages/injected
[types-wallets]: ./packages/types
[common-wallets]: ./packages/common
