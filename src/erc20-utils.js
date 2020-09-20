// import needed libs
import Web3 from "web3";

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';

// OPERA_CHAIN_ID is the chain id used by Fantom Opera blockchain.
const OPERA_CHAIN_ID = '0xfa';

// TESTNET_CHAIN_ID is the chain id used by Fantom Opera test net.
const TESTNET_CHAIN_ID = '0xfa2';

/**
 * erc20TransferTx creates a base transaction for transferring specified amount of ERC20
 * synth token to the given recipient address. No allowance is needed. The trx sending
 * address is also the owner of the tokens being send and has full control over them.
 *
 * @param {string} erc20Address
 * @param {string} recipientAddress
 * @param {string|{BN}} amount Amount to be transferred must be given in the token's decimals.
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function erc20TransferTx(erc20Address, recipientAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        to: erc20Address,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [recipientAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * erc20TransferFromTx creates a base transaction for transferring specified amount of ERC20
 * synth token from an owner address to a given recipient address.
 * NOT: The sending account (the account which signs the transaction) has to have
 * an allowance of a sufficient amount granted by the owner of tokens for the transfer to succeed.
 *
 * @param {string} erc20Address
 * @param {string} ownerAddress
 * @param {string} recipientAddress
 * @param {string|{BN}} amount Amount to be transferred must be given in the token's decimals.
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function erc20TransferFromTx(erc20Address, ownerAddress, recipientAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        to: erc20Address,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [ownerAddress, recipientAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * erc20IncreaseAllowanceTx creates a transaction for increasing Allowance by the given
 * amount for the ERC20 token and target contract/address.
 *
 * @param {string} erc20Address
 * @param {string} delegatedToAddress
 * @param {string|{BN}} addAmount
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function erc20IncreaseAllowanceTx(erc20Address, delegatedToAddress, addAmount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        to: erc20Address,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "addedValue",
                    "type": "uint256"
                }
            ],
            "name": "increaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [delegatedToAddress, addAmount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * erc20DecreaseAllowanceTx creates a transaction for decreasing Allowance by the given
 * amount for the ERC20 token and target contract/address.
 *
 * @param {string} erc20Address
 * @param {string} delegatedToAddress
 * @param {string|{BN}} subAmount
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function erc20DecreaseAllowanceTx(erc20Address, delegatedToAddress, subAmount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        to: erc20Address,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "subtractedValue",
                    "type": "uint256"
                }
            ],
            "name": "decreaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [delegatedToAddress, subAmount]),
        chainId: OPERA_CHAIN_ID
    };
}

// what we export here
export default {
    erc20TransferTx,
    erc20TransferFromTx,
    erc20IncreaseAllowanceTx,
    erc20DecreaseAllowanceTx,
    OPERA_CHAIN_ID,
    TESTNET_CHAIN_ID
};
