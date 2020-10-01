// import needed libs
import Web3 from 'web3';
import web3Utils from "web3-utils";

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';

// Get ABI definitions needed for the utility to operate.
const {abi: UNISWAP_ROUTER_ABI} = require('./abi/uniswap-router');

/**
 * uniswapNativeTokenAddress returns address of the native token wrapper
 * used by the Uniswap protocol.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @returns Promise<string>
 */
function uniswapNativeTokenAddress(web3, routerAddress) {
    // access the contract
    const contract = new web3.eth.Contract(UNISWAP_ROUTER_ABI, routerAddress);
    return contract.methods.wFTM().call();
}

/**
 * uniswapAddLiquidity creates a contract call transaction to add liquidity
 * to a Uniswap pool defined by pair of tokens.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string} tokenA
 * @param {string} tokenB
 * @param {string|{BN}} amountADesired
 * @param {string|{BN}} amountBDesired
 * @param {string|{BN}} amountAMin
 * @param {string|{BN}} amountBMin
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapAddLiquidity(
    web3,
    routerAddress,
    tokenA,
    tokenB,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    to,
    deadline
) {
    // make the transaction
    return {
        to: routerAddress,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenA",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "tokenB",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amountADesired",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountBDesired",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountAMin",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountBMin",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                }
            ],
            "name": "addLiquidity",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amountA",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountB",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "liquidity",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline])
    };
}

/**
 * uniswapAddLiquidityFtm creates a contract call transaction to add liquidity
 * to a Uniswap pool of the native token and another pair token.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string} token
 * @param {string|{BN}} amountTokenDesired
 * @param {string|{BN}} amountFtmDesired
 * @param {string|{BN}} amountTokenMin
 * @param {string|{BN}} amountFtmMin
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapAddLiquidityFtm(
    web3,
    routerAddress,
    token,
    amountTokenDesired,
    amountFtmDesired,
    amountTokenMin,
    amountFtmMin,
    to,
    deadline
) {
    // make the transaction
    return {
        to: routerAddress,
        value: web3Utils.numberToHex(amountFtmDesired),
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amountTokenDesired",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountTokenMin",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountETHMin",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                }
            ],
            "name": "addLiquidityETH",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amountToken",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountETH",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "liquidity",
                    "type": "uint256"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, [token, amountTokenDesired, amountTokenMin, amountFtmMin, to, deadline])
    };
}

/**
 * uniswapRemoveLiquidity creates a contract call transaction to remove liquidity
 * from a Uniswap pool defined by pair of tokens.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string} tokenA
 * @param {string} tokenB
 * @param {string|{BN}} liquidity
 * @param {string|{BN}} amountAMin
 * @param {string|{BN}} amountBMin
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapRemoveLiquidity(
    web3,
    routerAddress,
    tokenA,
    tokenB,
    liquidity,
    amountAMin,
    amountBMin,
    to,
    deadline
) {
    // make the transaction
    return {
        to: routerAddress,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenA",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "tokenB",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "liquidity",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountAMin",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountBMin",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                }
            ],
            "name": "removeLiquidity",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amountA",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountB",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline])
    };
}

/**
 * uniswapRemoveLiquidityFtm creates a contract call transaction to remove liquidity
 * from a Uniswap pool of the native token and another pair token.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string} token
 * @param {string|{BN}} liquidity
 * @param {string|{BN}} amountTokenMin
 * @param {string|{BN}} amountFtmMin
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapRemoveLiquidityFtm(
    web3,
    routerAddress,
    token,
    liquidity,
    amountTokenMin,
    amountFtmMin,
    to,
    deadline
) {
    // make the transaction
    return {
        to: routerAddress,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "liquidity",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountTokenMin",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountETHMin",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                }
            ],
            "name": "removeLiquidityETH",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amountToken",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountETH",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [token, liquidity, amountTokenMin, amountFtmMin, to, deadline])
    };
}

// what we export here
export default {
    uniswapNativeTokenAddress,
    uniswapAddLiquidity,
    uniswapAddLiquidityFtm,
    uniswapRemoveLiquidity,
    uniswapRemoveLiquidityFtm
};
