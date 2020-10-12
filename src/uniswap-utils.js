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
    return contract.methods.WETH().call();
}

/**
 * uniswapAmountsOut returns an array of intermediate and output amounts
 * for the given exact input amount and the Uniswap path represented
 * by an array of token addresses. If you want to use native FTM token
 * on the input, or output, use Wrapped FTM token address instead.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string|{BN}} amountIn
 * @param {[string]} path
 * @returns Promise<[BN]>
 */
function uniswapAmountsOut(web3, routerAddress, amountIn, path) {
    // access the contract and make sure to access it with the latest confirmed block context
    const contract = new web3.eth.Contract(UNISWAP_ROUTER_ABI, routerAddress);
    contract.defaultBlock = "latest";

    return contract.methods.getAmountsOut(amountIn, path).call();
}

/**
 * uniswapAmountsIn returns an array of intermediate and input amounts
 * for the given exact output amount and the Uniswap path represented
 * by an array of token addresses. If you want to use native FTM token
 * on the input, or output, use Wrapped FTM token address instead.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string|{BN}} amountOut
 * @param {[string]} path
 * @returns Promise<[BN]>
 */
function uniswapAmountsIn(web3, routerAddress, amountOut, path) {
    // access the contract and make sure to access it with the latest confirmed block context
    const contract = new web3.eth.Contract(UNISWAP_ROUTER_ABI, routerAddress);
    contract.defaultBlock = "latest";

    return contract.methods.getAmountsIn(amountOut, path).call();
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

/**
 * uniswapApproveShareTransfer creates a contract call transaction to allow transfer
 * of Uniswap pair share tokens from your address by the router.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string} pairAddress
 * @param {string|{BN}} amount
 */
function uniswapApproveShareTransfer(web3, routerAddress, pairAddress, amount) {
    // make the transaction
    return {
        to: pairAddress,
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
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
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
        }, [routerAddress, amount])
    };
}

/**
 * uniswapExactTokensForTokens creates a contract call transaction to swap between
 * two tokens through the given swap path specified by an array of tokens where
 * the first token is the entry one and the last token is the exit one. The input
 * amount is exact and the output amount is specified by expected minimal quantity.
 * Fuzziness of the call is towards the output. Allowance is required on input.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string|{BN}} amountIn
 * @param {string|{BN}} amountOutMin
 * @param {[string]} path
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapExactTokensForTokens(
    web3,
    routerAddress,
    amountIn,
    amountOutMin,
    path,
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
                    "internalType": "uint256",
                    "name": "amountIn",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountOutMin",
                    "type": "uint256"
                },
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
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
            "name": "swapExactTokensForTokens",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [amountIn, amountOutMin, path, to, deadline])
    };
}

/**
 * uniswapExactFtmForTokens creates a contract call transaction to swap between
 * two tokens through the given swap path specified by an array of tokens where
 * the first token is the Wrapped Native FTM one and the last token is the exit one.
 * The input amount is exact and the output amount is specified by expected minimal quantity.
 * Fuzziness of the call is towards the output. Native token in the input amount will be send
 * from the singing account.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string|{BN}} amountIn
 * @param {string|{BN}} amountOutMin
 * @param {[string]} path
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapExactFtmForTokens(
    web3,
    routerAddress,
    amountIn,
    amountOutMin,
    path,
    to,
    deadline
) {
    // make the transaction
    return {
        to: routerAddress,
        value: web3Utils.numberToHex(amountIn),
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amountOutMin",
                    "type": "uint256"
                },
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
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
            "name": "swapExactETHForTokens",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, [amountOutMin, path, to, deadline])
    };
}

/**
 * uniswapTokensForExactTokens creates a contract call transaction to swap between
 * two tokens through the given swap path specified by an array of tokens where
 * the first token is the entry one and the last token is the exit one. The output
 * amount is exact and the input amount is specified by maximal allowed quantity.
 * Fuzziness of the call is towards the input. Sufficient allowance is required
 * on input token to cover the max amount offered.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string|{BN}} amountOut
 * @param {string|{BN}} amountInMax
 * @param {[string]} path
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapTokensForExactTokens(
    web3,
    routerAddress,
    amountOut,
    amountInMax,
    path,
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
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountInMax",
                    "type": "uint256"
                },
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
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
            "name": "swapTokensForExactTokens",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [amountOut, amountInMax, path, to, deadline])
    };
}

/**
 * uniswapFtmForExactTokens creates a contract call transaction to swap between
 * two tokens through the given swap path specified by an array of tokens where
 * the first token is the Wrapped Native FTM and the last token is the exit one.
 * The output amount is exact and the input amount is specified by maximal allowed
 * quantity. Fuzziness of the call is towards the input. Native FTM tokens
 * in the maximal offered amount will be send to the contract, tokens remaining
 * after the swap will be returned back.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string|{BN}} amountOut
 * @param {string|{BN}} amountInMax
 * @param {[string]} path
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapFtmForExactTokens(
    web3,
    routerAddress,
    amountOut,
    amountInMax,
    path,
    to,
    deadline
) {
    // make the transaction
    return {
        to: routerAddress,
        value: web3Utils.numberToHex(amountInMax),
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                },
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
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
            "name": "swapETHForExactTokens",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, [amountOut, path, to, deadline])
    };
}

/**
 * uniswapTokensForExactFtm creates a contract call transaction to swap between
 * two tokens through the given swap path specified by an array of tokens where
 * the first token is the entry one and the last token is the Wrapped FTM. The output
 * amount is exact and the input amount is specified by maximal allowed quantity.
 * Fuzziness of the call is towards the input. Sufficient allowance is required
 * on input token to cover the max amount offered. Native FTM is returned on success.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string|{BN}} amountOut
 * @param {string|{BN}} amountInMax
 * @param {[string]} path
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapTokensForExactFtm(
    web3,
    routerAddress,
    amountOut,
    amountInMax,
    path,
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
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountInMax",
                    "type": "uint256"
                },
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
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
            "name": "swapTokensForExactETH",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [amountOut, amountInMax, path, to, deadline])
    };
}

/**
 * uniswapExactTokensForFtm creates a contract call transaction to swap between
 * two tokens through the given swap path specified by an array of tokens where
 * the first token is the entry one and the last token is the Wrapped FTM. The input
 * amount is exact and the output amount is specified by minimal expected quantity.
 * Fuzziness of the call is towards the output. Sufficient allowance is required
 * on input token to cover the max amount offered. Native FTM is returned on success.
 *
 * @param {Web3} web3
 * @param {string} routerAddress
 * @param {string|{BN}} amountIn
 * @param {string|{BN}} amountOutMin
 * @param {[string]} path
 * @param {string} to
 * @param {string|{BN}} deadline
 * @returns {{data: string, to: *, value: string}}
 */
function uniswapExactTokensForFtm(
    web3,
    routerAddress,
    amountIn,
    amountOutMin,
    path,
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
                    "internalType": "uint256",
                    "name": "amountIn",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amountOutMin",
                    "type": "uint256"
                },
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
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
            "name": "swapExactTokensForETH",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [amountIn, amountOutMin, path, to, deadline])
    };
}

// what we export here
export default {
    /************ utility ************/
    uniswapNativeTokenAddress,
    uniswapAmountsOut,
    uniswapAmountsIn,

    /*********** liquidity ***********/
    uniswapAddLiquidity,
    uniswapAddLiquidityFtm,
    uniswapRemoveLiquidity,
    uniswapRemoveLiquidityFtm,
    uniswapApproveShareTransfer,

    /*********** SWAP calls **********/
    uniswapExactTokensForTokens,
    uniswapExactFtmForTokens,
    uniswapTokensForExactTokens,
    uniswapFtmForExactTokens,
    uniswapTokensForExactFtm,
    uniswapExactTokensForFtm,
};
