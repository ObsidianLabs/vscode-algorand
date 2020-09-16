# Algorand VS Code Extension

This is a VS Code extension for the [Algorand Blockchain](https://www.algorand.com/).

## Functionality

This extension provides the following features:

- TEAL language support
  - TEAL syntax highlight
	- Hover information
	- Auto-complete
- TEAL & PyTeal compiler integration
- **Algorand Panel** as a dedicated interface
  - Use docker to install Algorand node ([algorand/stable](https://hub.docker.com/r/algorand/stable))
	- Manage Algorand node instances
	- Start a local node and connected to Algorand's [testnet](https://testnet.algoexplorer.io/) with snapshot
	- Display node logs
- Algorand transactions
	- Construct transactions with a user interface
	- Support [regular payment](https://developer.algorand.org/docs/features/transactions/signatures/#multisignatures), [atomic transfers](https://developer.algorand.org/docs/features/atomic_transfers/), [multi-sig](https://developer.algorand.org/docs/features/transactions/signatures/#multisignatures), [ASA operations](https://developer.algorand.org/docs/features/asa/) and [key registration](https://developer.algorand.org/docs/features/transactions/#key-registration-transaction)
	- Support stateless ASC executions for both [contract account](https://developer.algorand.org/docs/features/asc1/stateless/modes/#contract-account) and [delegated approval](https://developer.algorand.org/docs/features/asc1/stateless/modes/#delegated-approval)

## Structure

```
.
├── package.json // The extension manifest.
├── client
│   ├── src
│   │   ├── view // The frontend for Algorand Panel (React)
│   │   └── extension // Extension & Language Client
└── server // Language Server
    └── src
        └── server.ts // Entry point
```

## Run in dev mode

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder
- Press Ctrl+Shift+B to compile the client and server
- Switch to the Debug viewlet
- Select `Launch Client` from the drop down

## Build from source

- Run `npm install -g vsce`
- Run `npm install` in this folder
- Run `vsce package`