/**
 * Documentation can be found on this address:
 * https://docs.aave.com/developers/the-core-protocol/lendingpool
 */

// import needed libs
import Web3 from 'web3';

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';


/**
 * flendDeposit creates a contract call transaction to deposit amount
 * to flend reserve.
 * Deposits a certain amount of an asset into the protocol,
 * minting the same amount of corresponding aTokens,
 * and transferring them to the onBehalfOf address.
 *
 * @param {Web3} web3
 * @param {string} asset Reserve address.
 * @param {string|{BN}} amount Amount to be transfered.
 * @param {string} onBehalfOf Use msg.sender when the aTokens should be sent to the caller.
 * @param {string} referralCode
 * @returns {{data: string, to: *, value: string}}
 */
function fLendDeposit(
    web3,
    asset,
    amount,
    onBehalfOf,
    referralCode
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "asset",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "onBehalfOf",
                    "type": "address"
                },
                {
                    "internalType": "uint16",
                    "name": "referralCode",
                    "type": "uint16"
                }
            ],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }, [asset,amount,onBehalfOf,referralCode])
    };
}

/**
 * fLendWithdraw creates a contract call transaction to withdraw amount
 * from flend lending pool.
 * Withdraws amount of the underlying asset,
 * i.e. redeems the underlying token and burns the aTokens.
 *
 * @param {Web3} web3
 * @param {string} asset Reserve address.
 * @param {string|{BN}} amount Amount to be transfered. Use -1 to withdraw the entire balance.
 * @param {string} to Address that will receive the asset
 * @returns {{data: string, to: *, value: string}}
 */
function fLendWithdraw(
    web3,
    asset,
    amount,
    to
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "asset",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                }
            ],
            "name": "withdraw",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }, [asset, amount, to])
    };
}


/**
 * fLendBorrow creates a contract call transaction to borrow amount
 * of flend reserve.
 * Borrows amount of asset with interestRateMode,
 * sending the amount to msg.sender,
 * with the debt being incurred by onBehalfOf. 
 *
 * @param {Web3} web3
 * @param {string} asset Reserve address.
 * @param {string|{BN}} amount Amount to be transfered.
 * @param {string} interestRateMode Stable: 1, Variable: 2
 * @param {string} referralCode
 * @param {string} onBehalfOf Use msg.sender when not calling on behalf of a different user.
 * @returns {{data: string, to: *, value: string}}
 */
function fLendBorrow(
    web3,
    asset,
    amount,
    interestRateMode,
    referralCode,
    onBehalfOf,
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                "internalType": "address",
                "name": "asset",
                "type": "address"
                },
                {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "interestRateMode",
                "type": "uint256"
                },
                {
                "internalType": "uint16",
                "name": "referralCode",
                "type": "uint16"
                },
                {
                "internalType": "address",
                "name": "onBehalfOf",
                "type": "address"
                }
            ],
            "name": "borrow",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }, [asset,amount,interestRateMode,referralCode,onBehalfOf])
    };
}

/**
 * fLendRepay creates a contract call transaction.
 * Repays onBehalfOf's debt amount of asset which has a rateMode.
 *
 * @param {Web3} web3
 * @param {string} asset Reserve address.
 * @param {string|{BN}} amount Amount to be transfered.
 * @param {string} rateMode Stable: 1, Variable: 2
 * @param {string} onBehalfOf
 * @returns {{data: string, to: *, value: string}}
 */
function fLendRepay(
    web3,
    asset,
    amount,
    rateMode,
    onBehalfOf,
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "asset",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "rateMode",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "onBehalfOf",
                    "type": "address"
                }
            ],
            "name": "repay",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }, [asset, amount, rateMode, onBehalfOf])
    };
}

/**
 * fLendSwapBorrowRateMode creates a contract call transaction to
 * Swap the msg.sender's borrow rate modes between stable and variable.
 * The rate mode: Stable: 1, Variable: 2
 * 
 * @param {Web3} web3
 * @param {string} asset Reserve address.
 * @param {string} rateMode Stable: 1, Variable: 2
 * @returns {{data: string, to: *, value: string}}
 */
function fLendSwapBorrowRateMode(
    web3,
    asset,
    rateMode,
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                  "internalType": "address",
                  "name": "asset",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "rateMode",
                  "type": "uint256"
                }
              ],
              "name": "swapBorrowRateMode",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
        }, [asset, rateMode])
    };
}

/**
 * fLendSetUserUseReserveAsCollateral creates a contract call transaction to
 * set the asset of msg.sender to be used as collateral or not.
 * 
 * @param {Web3} web3
 * @param {string} asset Reserve address.
 * @param {string} useAsCollateral true if the asset should be used as collateral
 * @returns {{data: string, to: *, value: string}}
 */
function fLendSetUserUseReserveAsCollateral(
    web3,
    asset,
    useAsCollateral,
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                  "internalType": "address",
                  "name": "asset",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "useAsCollateral",
                  "type": "bool"
                }
              ],
              "name": "setUserUseReserveAsCollateral",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
        }, [asset, useAsCollateral])
    };
}

/**
 * fLendFlashLoan sends the requested amounts of assets to the
 * receiverAddress contract, passing the included params.
 * If the flash loaned amounts + fee is not returned
 * by the end of the transaction, then the transaction will either: 
 * revert if the associated mode is 0,
 * onBehalfOf incurs a stable debt if mode is 1,
 * or
 * onBehalfOf incurs a variable debt if mode is 2.

 * @param {Web3} web3
 * @param {string} address Receiver address.
 * @param {[string]} assets Reserves addresses.
 * @param {[string|{BN}]} amounts Amounts of assets to flashloan.
 * @param {[string]} modes the types of debt to open if the flashloan is not returned.
 *                   0: Don't open any debt, just revert
 *                   1: stable mode debt
 *                   2: variable mode debt   
 * @param {string} onBehalfOf
 * @param {string} params Bytes-encoded parameters to be used by the receiverAddress contract
 * @param {string} referralCode
 * @returns {{data: string, to: *, value: string}}
 */
function fLendFlashLoan(
    web3,
    address,
    assets,
    amounts,
    modes,
    onBehalfOf,
    params,
    referralCode,
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        to: lendingPoolAddress,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                  "internalType": "address",
                  "name": "receiverAddress",
                  "type": "address"
                },
                {
                  "internalType": "address[]",
                  "name": "assets",
                  "type": "address[]"
                },
                {
                  "internalType": "uint256[]",
                  "name": "amounts",
                  "type": "uint256[]"
                },
                {
                  "internalType": "uint256[]",
                  "name": "modes",
                  "type": "uint256[]"
                },
                {
                  "internalType": "address",
                  "name": "onBehalfOf",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "params",
                  "type": "bytes"
                },
                {
                  "internalType": "uint16",
                  "name": "referralCode",
                  "type": "uint16"
                }
              ],
              "name": "flashLoan",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
        }, [address,assets,amounts,modes,onBehalfOf,params,referralCode,])
    };
}


/**
 * fLendLiquidationCall Liquidate positions with a health factor
 * below 1. Also see Liquidations guide for more details.
 * 
 * @param {Web3} web3
 * @param {string} address Collateral address.
 * @param {string} debt Debt addresses.
 * @param {string} user Address of the borrower.
 * @param {string|{BN}}  debtToCover Amount of asset debt that the liquidator will repay.
 * @param {string} receiveAToken bool
 * @returns {{data: string, to: *, value: string}}
 */
function fLendLiquidationCall(
    web3,
    address,
    debt,
    user,
    debtToCover,
    receiveAToken,
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                  "internalType": "address",
                  "name": "collateralAsset",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "debtAsset",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "debtToCover",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "receiveAToken",
                  "type": "bool"
                }
              ],
              "name": "liquidationCall",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
        }, [address,debt,user,debtToCover,receiveAToken])
    };
}

// what we export here
export default {
    fLendDeposit,
    fLendWithdraw,
    fLendBorrow,
    fLendRepay,
    fLendSwapBorrowRateMode,
    fLendSetUserUseReserveAsCollateral,
    fLendFlashLoan,
    fLendLiquidationCall,
};
