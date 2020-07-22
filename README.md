# Fantom Client JS Utils
The code implements JS library for simplified work with specific tools and interfaces
of the Fantom Opera blockchain client ecosystem. There are several modules available 
in the library and they cover following client workflows: 

- **Communication with the Fantom Ledger Nano S app.** 
    
    The library is compatible with the [Fantom Ledger  Nano S Application](https://github.com/Fantom-foundation/fantom-ledger).
    Please follow instructions on the linked repository to deploy your copy
    of the Fantom Ledger HW wallet application.
    
- **Staking and rewards related SFC commands.** 

    The library contains a module for building transactions
    used to invoke a subset of Fantom Opera SFC contract operations. The calls covered 
    by the library allow you to create and manage native tokens delegation 
    and delegation rewards.
    
- **DeFi smart contract calls.** 

    The library contains a module for building transactions
    used to invoke Fantom DeFi smart contract commands and manage your ERC20 tokens.     

# How to use generated transactions
Most functions in the library allow you to build base transactions for certain smart contract
calls. If the contract call mutates the blockchain state, e.g. if it changes anything inside 
the blockchain, you have to use signed transactions to invoke such call. The library is able 
to provide pre-formatted call structure, but you still need valid Web3, or similar provider
to sign the transaction, fill the missing details (like the current gas price) and send the 
signed transaction to the Opera node for processing.

Please check the [Web3.js](https://web3js.readthedocs.io/) documentation about your options
for signing transactions and sending them to the block chain. You will need and API 
endpoint address of an Opera node, either local or remote, to be able to proceed.      

# How to use the Ledger module
Please note you absolutely have to use HTTPS for Fantom Ledger Application
communication using this library. It utilizes U2F protocol to exchange
data between your browser and the Ledger hardware token and the U2F protocol
is available only if the origin of the web page uses secured channel.

You need to have the Fantom Ledger application installed on your Ledger
token to have the other side to communicate with. If you don't, Please
follow the Ledger manual and install your application. If not available,
you can deploy it directly from our GitHub repository.

[Fantom Ledger Nano S Application repository](https://github.com/Fantom-foundation/fantom-ledger)

In this case you app will not have the correct signature and so the
Ledger device will always ask you for a permission before opening the app.

## Available Scripts

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles in production mode and optimizes the build for the best performance.

### `npm test`

Executes Mocha/Chai unit tests on the SFC support library. These tests cover building SFC transaction
calls for the most common delegations and staking related operations supported by the SFC contract.
   
