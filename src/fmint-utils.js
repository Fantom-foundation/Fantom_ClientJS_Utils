// import needed libs
import Web3 from "web3";

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
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function fMintDepositTokenTx(fMintContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
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
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function fMintWithdrawTokenTx(fMintContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
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
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function fMintMintTokenTx(fMintContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
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
 * fMintMintTokenMaxTx creates a base transaction for minting
 * the highest possible amount of target tokens against outstanding collateral.
 *
 * @param {string} fMintContract
 * @param {string} tokenAddress
 * @param {string|{BN}|undefined} targetRatio4dec
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function fMintMintTokenMaxTx(fMintContract, tokenAddress, targetRatio4dec) {
    // create web3.js instance
    const web3 = new Web3();

    // use default target ratio, if not set
    if ("undefined" == typeof targetRatio4dec) {
        // this is the default ration 300%
        // with 4 digits precision and encoded to hex
        // the actual value is: 30000
        targetRatio4dec = "0x7530";
    }

    // make the transaction
    return {
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
                    "name": "_ratio",
                    "type": "uint256"
                }
            ],
            "name": "mustMintMax",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress, targetRatio4dec]),
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
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function fMintRepayTokenTx(fMintContract, tokenAddress, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
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
 * fMintRepayTokenMaxTx creates a base transaction for burning
 * maxim amount of tokens from the account debt as possible.
 *
 * @param {string} fMintContract
 * @param {string} tokenAddress
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function fMintRepayTokenMaxTx(fMintContract, tokenAddress) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        to: fMintContract,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_token",
                    "type": "address"
                }
            ],
            "name": "mustRepayMax",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenAddress]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * fMintClaimRewardTx creates a base transaction for claiming
 * rewards from over-collateralized mint.
 *
 * @param {string} fMintRewardContract Address of the fMint Reward Distribution contract.
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function fMintClaimRewardTx(fMintRewardContract) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
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
 * @return {{data: string, chainId: string, to: string, value: string}}
 */
function fMintPushRewardTx(fMintRewardContract) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
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
    fMintMintTokenMaxTx,
    fMintRepayTokenTx,
    fMintRepayTokenMaxTx,
    fMintClaimRewardTx,
    fMintPushRewardTx,
    OPERA_CHAIN_ID,
    TESTNET_CHAIN_ID
};
