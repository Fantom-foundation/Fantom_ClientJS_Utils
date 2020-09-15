// import needed libs
import Web3 from "web3";

// DEFAULT_GAS_LIMIT represents the maximum amount of gas we are willing
// to pay for the DeFi calls.
const DEFAULT_GAS_LIMIT = '0x2dc6c0';

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';

// OPERA_CHAIN_ID is the chain id used by Fantom Opera blockchain.
const OPERA_CHAIN_ID = '0xfa';

// TESTNET_CHAIN_ID is the chain id used by Fantom Opera test net.
const TESTNET_CHAIN_ID = '0xfa2';

/**
 * defiFMintDepositTokenTx creates a base transaction for sending specified
 * tokens into the fMint Collateral Pool.
 *
 * @param {string} fMintContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function fMintDepositTokenTx(fMintContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: fMintContract,
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
            "name": "mustDeposit",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * fMintWithdrawTokenTx creates a base transaction for pulling specified
 * tokens from the fMint Collateral Pool to lower on user's collateral if possible.
 *
 * @param {string} fMintContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function fMintWithdrawTokenTx(fMintContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: fMintContract,
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
            "name": "mustWithdraw",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * fMintMintTokenTx creates a base transaction for minting
 * specified amount of target tokens against outstanding collateral.
 *
 * @param {string} fMintContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function fMintMintTokenTx(fMintContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: fMintContract,
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
            "name": "mustMint",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * fMintRepayTokenTx creates a base transaction for burning
 * specified amount of target tokens to unlock outstanding collateral.
 *
 * @param {string} fMintContract
 * @param {string} tokenAddress
 * @param {string|{BN}} amount
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function fMintRepayTokenTx(fMintContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: fMintContract,
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
            "name": "mustRepay",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, amount]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * fMintClaimRewardTx creates a base transaction for claiming
 * rewards from over-collateralized mint.
 *
 * @param {string} fMintRewardContract Address of the fMint Reward Distribution contract.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function fMintClaimRewardTx(fMintRewardContract) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: fMintRewardContract,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [],
            "name": "mustRewardClaim",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, []),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * fMintPushRewardTx creates a base transaction for pushing unlocked rewards
 * to the reward distribution. Any user can initiate the reward push to start
 * earning.
 *
 * @param {string} fMintRewardContract Address of the fMint Reward Distribution contract.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function fMintPushRewardTx(fMintRewardContract) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: fMintRewardContract,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [],
            "name": "mustRewardPush",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, []),
        chainId: OPERA_CHAIN_ID
    };
}

// what we export here
export default {
    fMintDepositTokenTx,
    fMintWithdrawTokenTx,
    fMintMintTokenTx,
    fMintRepayTokenTx,
    fMintClaimRewardTx,
    fMintPushRewardTx,
    OPERA_CHAIN_ID,
    TESTNET_CHAIN_ID
};
