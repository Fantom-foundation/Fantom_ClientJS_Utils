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

const ProtocolRevertCodes = {
    //common errors
    CALLER_NOT_POOL_ADMIN = '33', // 'The caller must be the pool admin'

    //contract specific errors
    VL_INVALID_AMOUNT = '1', // 'Amount must be greater than 0'
    VL_NO_ACTIVE_RESERVE = '2', // 'Action requires an active reserve'
    VL_RESERVE_FROZEN = '3', // 'Action requires an unfrozen reserve'
    VL_CURRENT_AVAILABLE_LIQUIDITY_NOT_ENOUGH = '4', // 'The current liquidity is not enough'
    VL_NOT_ENOUGH_AVAILABLE_USER_BALANCE = '5', // 'User cannot withdraw more than the available balance'
    VL_TRANSFER_NOT_ALLOWED = '6', // 'Transfer cannot be allowed.'
    VL_BORROWING_NOT_ENABLED = '7', // 'Borrowing is not enabled'
    VL_INVALID_INTEREST_RATE_MODE_SELECTED = '8', // 'Invalid interest rate mode selected'
    VL_COLLATERAL_BALANCE_IS_0 = '9', // 'The collateral balance is 0'
    VL_HEALTH_FACTOR_LOWER_THAN_LIQUIDATION_THRESHOLD = '10', // 'Health factor is lesser than the liquidation threshold'
    VL_COLLATERAL_CANNOT_COVER_NEW_BORROW = '11', // 'There is not enough collateral to cover a new borrow'
    VL_STABLE_BORROWING_NOT_ENABLED = '12', // stable borrowing not enabled
    VL_COLLATERAL_SAME_AS_BORROWING_CURRENCY = '13', // collateral is (mostly) the same currency that is being borrowed
    VL_AMOUNT_BIGGER_THAN_MAX_LOAN_SIZE_STABLE = '14', // 'The requested amount is greater than the max loan size in stable rate mode
    VL_NO_DEBT_OF_SELECTED_TYPE = '15', // 'for repayment of stable debt, the user needs to have stable debt, otherwise, he needs to have variable debt'
    VL_NO_EXPLICIT_AMOUNT_TO_REPAY_ON_BEHALF = '16', // 'To repay on behalf of an user an explicit amount to repay is needed'
    VL_NO_STABLE_RATE_LOAN_IN_RESERVE = '17', // 'User does not have a stable rate loan in progress on this reserve'
    VL_NO_VARIABLE_RATE_LOAN_IN_RESERVE = '18', // 'User does not have a variable rate loan in progress on this reserve'
    VL_UNDERLYING_BALANCE_NOT_GREATER_THAN_0 = '19', // 'The underlying balance needs to be greater than 0'
    VL_DEPOSIT_ALREADY_IN_USE = '20', // 'User deposit is already being used as collateral'
    LP_NOT_ENOUGH_STABLE_BORROW_BALANCE = '21', // 'User does not have any stable rate loan for this reserve'
    LP_INTEREST_RATE_REBALANCE_CONDITIONS_NOT_MET = '22', // 'Interest rate rebalance conditions were not met'
    LP_LIQUIDATION_CALL_FAILED = '23', // 'Liquidation call failed'
    LP_NOT_ENOUGH_LIQUIDITY_TO_BORROW = '24', // 'There is not enough liquidity available to borrow'
    LP_REQUESTED_AMOUNT_TOO_SMALL = '25', // 'The requested amount is too small for a FlashLoan.'
    LP_INCONSISTENT_PROTOCOL_ACTUAL_BALANCE = '26', // 'The actual balance of the protocol is inconsistent'
    LP_CALLER_NOT_LENDING_POOL_CONFIGURATOR = '27', // 'The caller is not the lending pool configurator'
    LP_INCONSISTENT_FLASHLOAN_PARAMS = '28',
    CT_CALLER_MUST_BE_LENDING_POOL = '29', // 'The caller of this function must be a lending pool'
    CT_CANNOT_GIVE_ALLOWANCE_TO_HIMSELF = '30', // 'User cannot give allowance to himself'
    CT_TRANSFER_AMOUNT_NOT_GT_0 = '31', // 'Transferred amount needs to be greater than zero'
    RL_RESERVE_ALREADY_INITIALIZED = '32', // 'Reserve has already been initialized'
    LPC_RESERVE_LIQUIDITY_NOT_0 = '34', // 'The liquidity of the reserve needs to be 0'
    LPC_INVALID_ATOKEN_POOL_ADDRESS = '35', // 'The liquidity of the reserve needs to be 0'
    LPC_INVALID_STABLE_DEBT_TOKEN_POOL_ADDRESS = '36', // 'The liquidity of the reserve needs to be 0'
    LPC_INVALID_VARIABLE_DEBT_TOKEN_POOL_ADDRESS = '37', // 'The liquidity of the reserve needs to be 0'
    LPC_INVALID_STABLE_DEBT_TOKEN_UNDERLYING_ADDRESS = '38', // 'The liquidity of the reserve needs to be 0'
    LPC_INVALID_VARIABLE_DEBT_TOKEN_UNDERLYING_ADDRESS = '39', // 'The liquidity of the reserve needs to be 0'
    LPC_INVALID_ADDRESSES_PROVIDER_ID = '40', // 'The liquidity of the reserve needs to be 0'
    LPC_CALLER_NOT_EMERGENCY_ADMIN = '76', // 'The caller must be the emergencya admin'
    LPAPR_PROVIDER_NOT_REGISTERED = '41', // 'Provider is not registered'
    LPCM_HEALTH_FACTOR_NOT_BELOW_THRESHOLD = '42', // 'Health factor is not below the threshold'
    LPCM_COLLATERAL_CANNOT_BE_LIQUIDATED = '43', // 'The collateral chosen cannot be liquidated'
    LPCM_SPECIFIED_CURRENCY_NOT_BORROWED_BY_USER = '44', // 'User did not borrow the specified currency'
    LPCM_NOT_ENOUGH_LIQUIDITY_TO_LIQUIDATE = '45', // "There isn't enough liquidity available to liquidate"
    LPCM_NO_ERRORS = '46', // 'No errors'
    LP_INVALID_FLASHLOAN_MODE = '47', //Invalid flashloan mode selected
    MATH_MULTIPLICATION_OVERFLOW = '48',
    MATH_ADDITION_OVERFLOW = '49',
    MATH_DIVISION_BY_ZERO = '50',
    RL_LIQUIDITY_INDEX_OVERFLOW = '51', //  Liquidity index overflows uint128
    RL_VARIABLE_BORROW_INDEX_OVERFLOW = '52', //  Variable borrow index overflows uint128
    RL_LIQUIDITY_RATE_OVERFLOW = '53', //  Liquidity rate overflows uint128
    RL_VARIABLE_BORROW_RATE_OVERFLOW = '54', //  Variable borrow rate overflows uint128
    RL_STABLE_BORROW_RATE_OVERFLOW = '55', //  Stable borrow rate overflows uint128
    CT_INVALID_MINT_AMOUNT = '56', //invalid amount to mint
    LP_FAILED_REPAY_WITH_COLLATERAL = '57',
    CT_INVALID_BURN_AMOUNT = '58', //invalid amount to burn
    LP_BORROW_ALLOWANCE_NOT_ENOUGH = '59', // User borrows on behalf, but allowance are too small
    LP_FAILED_COLLATERAL_SWAP = '60',
    LP_INVALID_EQUAL_ASSETS_TO_SWAP = '61',
    LP_REENTRANCY_NOT_ALLOWED = '62',
    LP_CALLER_MUST_BE_AN_ATOKEN = '63',
    LP_IS_PAUSED = '64', // 'Pool is paused'
    LP_NO_MORE_RESERVES_ALLOWED = '65',
    LP_INVALID_FLASH_LOAN_EXECUTOR_RETURN = '66',
    RC_INVALID_LTV = '67',
    RC_INVALID_LIQ_THRESHOLD = '68',
    RC_INVALID_LIQ_BONUS = '69',
    RC_INVALID_DECIMALS = '70',
    RC_INVALID_RESERVE_FACTOR = '71',
    LPAPR_INVALID_ADDRESSES_PROVIDER_ID = '72'
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
    ProtocolRevertCodes,
};
