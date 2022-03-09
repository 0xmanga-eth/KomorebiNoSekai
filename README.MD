<div align="center">
  <h1 align="center">Komorebi No Sekai</h1>
  <p align="center">
    <a href="https://twitter.com/intent/follow?screen_name=KomorebiNoSekai">
        <img src="https://img.shields.io/twitter/follow/KomorebiNoSekai?style=social&logo=twitter"
            alt="follow on Twitter"></a>
    <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"
            alt="License"></a>
    <a href=""><img src="https://img.shields.io/badge/semver-0.0.1-blue"
            alt="License"></a>            
  </p>
  
  <h3 align="center">8.888 Komorebi Naitos with 200 unique traits coming soon on Ethereum Blockchain! </h3>
</div>

## Usage

### Pre Requisites

Proceed with installing dependencies:

```sh
yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### Generate ABIs

Generate the smart contracts ABI files with Hardhat:

```sh
$ yarn abi
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
$ yarn typechain
```

### Format code

Format the code:

```sh
$ yarn prettier
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

Deploy the contracts to Hardhat Network:

```sh
$ yarn deploy
```

## Syntax Highlighting

If you use VSCode, you can enjoy syntax highlighting for your Solidity code via the
[vscode-solidity](https://github.com/juanfranblanco/vscode-solidity) extension. The recommended approach to set the
compiler version is to add the following fields to your VSCode user settings:

```json
{
  "solidity.compileUsingRemoteVersion": "v0.8.4+commit.c7e474f2",
  "solidity.defaultCompiler": "remote"
}
```

Where of course `v0.8.4+commit.c7e474f2` can be replaced with any other version.
