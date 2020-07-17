// import needed libs
import Web3 from "web3";
import web3Utils from "web3-utils";

// DEFAULT_GAS_LIMIT represents the maximum amount of gas we are willing
// to pay for the DeFi calls.
const DEFAULT_GAS_LIMIT = '0x2dc6c0';

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';

// OPERA_CHAIN_ID is the chain id used by Fantom Opera blockchain.
const OPERA_CHAIN_ID = '0xfa';

// TESTNET_CHAIN_ID is the chain id used by Fantom Opera test net.
const TESTNET_CHAIN_ID = '0xfa2';

// NATIVE_TOKEN represents a predefined address of the native FTM token.
const NATIVE_TOKEN = '0xffffffffffffffffffffffffffffffffffffffff';

/**
 * defiDepositTokenTx creates a base transaction for sending specified
 * tokens into the Liquidity Pool to participate on user's collateral.
 *
 * @param {string} liquidityPoolContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function defiDepositTokenTx(liquidityPoolContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // is the token native FTM?
    let value = ZERO_AMOUNT;
    if (tokenAddress.toLocaleLowerCase() === NATIVE_TOKEN) {
        value = web3Utils.numberToHex(amount)
    }

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: liquidityPoolContract,
        value: value,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "deposit",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * defiWithdrawDepositedTokenTx creates a base transaction for pulling specified
 * tokens from the Liquidity Pool to lower on user's collateral if possible.
 *
 * @param {string} liquidityPoolContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function defiWithdrawDepositedTokenTx(liquidityPoolContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: liquidityPoolContract,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * defiBuyTokenTx creates a base transaction for buying specified
 * tokens from the Liquidity Pool directly by paying in fUSD.
 *
 * @param {string} liquidityPoolContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function defiBuyTokenTx(liquidityPoolContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: liquidityPoolContract,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "buy",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * defiSellTokenTx creates a base transaction for selling specified
 * tokens to the Liquidity Pool directly to get fUSD.
 *
 * @param {string} liquidityPoolContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function defiSellTokenTx(liquidityPoolContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: liquidityPoolContract,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "sell",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * defiBorrowTokenTx creates a base transaction for borrowing specified
 * tokens from the Liquidity Pool against active collateral.
 *
 * @param {string} liquidityPoolContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function defiBorrowTokenTx(liquidityPoolContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: liquidityPoolContract,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "borrow",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * defiRepayTokenTx creates a base transaction for returning specified
 * tokens back to the Liquidity Pool lowering the user's debt
 * and rising collateral ratio.
 *
 * @param {string} liquidityPoolContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function defiRepayTokenTx(liquidityPoolContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: liquidityPoolContract,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "repay",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

// what we export here
export default {
    defiDepositTokenTx,
    defiWithdrawDepositedTokenTx,
    defiBuyTokenTx,
    defiSellTokenTx,
    defiBorrowTokenTx,
    defiRepayTokenTx,
    OPERA_CHAIN_ID,
    TESTNET_CHAIN_ID
};
