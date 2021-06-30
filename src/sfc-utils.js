import Web3 from "web3";
import web3Utils from "web3-utils";
import {AbiItem} from 'web3-utils';

// SFC_CONTRACT_ADDRESS is the address on which the SFC smart contract is deployed.
const SFC_CONTRACT_ADDRESS = '0xfc00face00000000000000000000000000000000';

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';

// OPERA_CHAIN_ID is the chain id used by Fantom Opera blockchain.
const OPERA_CHAIN_ID = '0xfa';

/**
 * encodeCall encodes contract call for the given ABI item
 * and list of parameters using provided Web3 client.
 * If the client is not provided, a new instance is made.
 *
 * @param {Web3|undefined} client
 * @param {AbiItem} abi
 * @param {[]} params
 * @returns {string}
 */
function encodeCall(client, abi, params) {
    // make a Web3 instance if needed
    if ("object" !== typeof client || !client.hasOwnProperty('eth')) {
        client = new Web3();
    }
    return client.eth.abi.encodeFunctionCall(abi, params);
}

/**
 * createDelegationTx creates a new delegation transaction structure
 * for the given amount and validator index.
 *
 * @param {number|BN|string} amount Amount of FTM tokens in WEI units to delegate.
 * @param {int} to Id of the validator to delegate to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function createDelegationTx(amount, to, web3Client) {
    // validate staking id
    if (to <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // make the transaction
    return {
        chainId: OPERA_CHAIN_ID,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: web3Utils.numberToHex(amount),
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "toValidatorID",
                    "type": "uint256"
                }
            ],
            "name": "delegate",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, [web3Utils.numberToHex(to)]),
    };
}

/**
 * increaseDelegationTx creates a new increase delegation transaction structure
 * for the given amount.
 *
 * Note: A delegation has to exist already on the source address
 * for the transaction to be accepted on the server.
 *
 * @param {number|string|BN} amount Amount of FTM tokens in WEI units to delegate.
 * @param {int} to Id of the validator to delegate to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function increaseDelegationTx(amount, to, web3Client) {
    return createDelegationTx(amount, to, web3Client);
}

/**
 * claimDelegationRewardsCompoundTx creates a new delegator rewards claiming transaction.
 * The call transfers all the rewards from SFC back to the stake in single transaction.
 *
 * @param {int} maxEpochs The value is ignored.
 * @param {int} to Id of the validator to delegate to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function claimDelegationRewardsCompoundTx(maxEpochs, to, web3Client) {
    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }
    return {
        chainId: OPERA_CHAIN_ID,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "toValidatorID",
                    "type": "uint256"
                }
            ],
            "name": "restakeRewards",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(to)])
    };
}

/**
 * claimDelegationRewardsTx creates a new delegator rewards claiming transaction.
 * We have the call formatted for SFC tag 1.0.0; the 1.1.0-rc1 has
 * only one parameter here, no starting epoch.
 *
 * @param {int} maxEpochs The value is ignored.
 * @param {int} to Id of the validator to delegate to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function claimDelegationRewardsTx(maxEpochs, to, web3Client) {
    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        chainId: OPERA_CHAIN_ID,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "toValidatorID",
                    "type": "uint256"
                }
            ],
            "name": "claimRewards",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(to)])
    };
}

/**
 * claimValidatorRewardsTx creates a new validator rewards claiming transaction.
 * We have the call formatted for SFC tag 1.0.0; the 1.1.0-rc1 has
 * only one parameter here, no starting epoch.
 *
 * @param {number} maxEpochs Max number of epochs to claim.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function claimValidatorRewardsTx(maxEpochs, web3Client) {
    throw 'Validators use delegation rewards management functions in the current SFC version.';
}

/**
 * prepareToWithdrawDelegationTx creates a transaction preparing delegations
 * to be withdrawn.
 *
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function prepareToWithdrawDelegationTx(to, web3Client) {
    throw 'You must use undelegate function on the current SFC version.';
}

/**
 * prepareToWithdrawDelegationPartTx creates a transaction preparing part of the delegations
 * to be withdrawn.
 *
 * Note: The amount must be lower than the total delegation amount for that account. Also,
 * the requestId value has to be unique and previously unused numeric identifier of the new
 * withdrawal. The actual withdraw execution, available after a lock period, will use the same
 * request id to process the prepared withdrawal.
 *
 * @param {number|string|BN} requestId Unique and unused identifier of the withdraw request.
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {number|string|BN} amount Amount of FTM tokens in WEI units to be prepared for withdraw.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function prepareToWithdrawDelegationPartTx(requestId, to, amount, web3Client) {
    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        chainId: OPERA_CHAIN_ID,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "toValidatorID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "wrID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "undelegate",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [
            web3Utils.numberToHex(to),
            web3Utils.numberToHex(requestId),
            web3Utils.numberToHex(amount)])
    };
}

/**
 * withdrawPartTx creates a transaction executing partial withdraw for the given
 * prepared withdraw request.
 *
 * Note: The request id has to exist and has to be prepared for the withdraw to execute
 * correctly.
 *
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {number} requestId Unique and unused identifier of the withdraw request.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function withdrawPartTx(to, requestId, web3Client) {
    // request id has to be uint
    if (!Number.isInteger(requestId) || (0 >= requestId)) {
        throw 'Request id must be a valid numeric identifier.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        chainId: OPERA_CHAIN_ID,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "toValidatorID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "wrID",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(to), web3Utils.numberToHex(requestId)])
    };
}


/**
 * withdrawDelegationTx creates a transaction withdrawing prepared delegation.
 *
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function withdrawDelegationTx(to, web3Client) {
    throw 'Can not withdraw without previous request ID.';
}

/**
 * lockupDelegationTx creates a transaction for locking delegation.
 *
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {int} duration Number of seconds the lock should be activated.
 * @param {number|string|BN} amount Amount of FTM tokes in WEI format to be prepared for withdraw.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function lockupDelegationTx(to, duration, amount, web3Client) {
    // validate staking id
    if (to <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate minimal duration
    if (!Number.isInteger(duration)) {
        throw 'The lock duration must be at least 14 days.';
    }

    // validate maximal duration
    if (duration > (365 * 86400)) {
        throw 'The lock duration must be at most 365 days.';
    }

    return {
        chainId: OPERA_CHAIN_ID,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "toValidatorID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "lockupDuration",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "lockStake",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [
            web3Utils.numberToHex(to),
            web3Utils.numberToHex(duration),
            web3Utils.numberToHex(amount)
        ])
    };
}

/**
 * relockDelegationTx creates a transaction for re-locking delegation.
 *
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {int} duration Number of seconds the lock should be activated.
 * @param {number|string|BN} amount Amount of FTM tokes in WEI format to be prepared for withdraw.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function relockDelegationTx(to, duration, amount, web3Client) {
    // validate staking id
    if (to <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate minimal duration
    if (!Number.isInteger(duration)) {
        throw 'The lock duration must be at least 14 days.';
    }

    // validate maximal duration
    if (duration > (365 * 86400)) {
        throw 'The lock duration must be at most 365 days.';
    }

    return {
        chainId: OPERA_CHAIN_ID,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "toValidatorID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "lockupDuration",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "relockStake",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [
            web3Utils.numberToHex(to),
            web3Utils.numberToHex(duration),
            web3Utils.numberToHex(amount)
        ])
    };
}

/**
 * unlockDelegationTx creates a transaction for unlocking delegation.
 *
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {number|string|BN} amount Amount of FTM tokens in WEI units to be prepared for withdraw.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function unlockDelegationTx(to, amount, web3Client) {
    // validate staking id
    if (to <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        chainId: OPERA_CHAIN_ID,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "toValidatorID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "unlockStake",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [
            web3Utils.numberToHex(to),
            web3Utils.numberToHex(amount)
        ])
    };
}

/**
 * unstashRewardsTx creates a transaction withdrawing stashed amount on account.
 *
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{data: string, to: *, value: string}}
 */
function unstashRewardsTx(web3Client) {
    throw 'You must use claimRewards, or restakeRewards function on the current SFC.';
}

/**
 * sfcTokenizeLockedStake generates a transaction instructing given SFC stake tokenizer
 * contract to mint tokenized stake sFTM to the sender address representing their locked
 * stake or delegation.
 *
 * @param {Web3} web3Client
 * @param {string} tokenizer Address of the SFC tokenizer contract.
 * @param {int} stakerId Identifier of the validator the stake/delegation belongs to.
 * @return {{data: string, to: *, value: string, chainId: string}}
 */
function sfcTokenizeLockedStake(web3Client, tokenizer, stakerId) {
    // validate staking id
    if (stakerId <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(stakerId) || (0 >= stakerId)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        to: tokenizer,
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "toStakerID",
                    "type": "uint256"
                }
            ],
            "name": "mintSFTM",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [stakerId]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * sfcRedeemTokenizedStake generates a transaction instructing given SFC stake tokenizer
 * contract to redeem tokens of a tokenized stake sFTM from the sender address.
 * Please note, the tokenizer must be granted allowance on the sFTM token
 * at least for the redeemed amount of tokens.
 *
 * @param {Web3} web3Client
 * @param {string} tokenizer Address of the SFC tokenizer contract.
 * @param {int} stakerId Identifier of the validator the stake/delegation belongs to.
 * @param {number|string|BN} amount Amount of FTM tokens in WEI units to be redeemed.
 * @return {{data: string, to: *, value: string, chainId: string}}
 */
function sfcRedeemTokenizedStake(web3Client, tokenizer, stakerId, amount) {
    // validate staking id
    if (stakerId <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(stakerId) || (0 >= stakerId)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        to: tokenizer,
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "stakerID",
                    "type": "uint256"
                }, {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "redeemSFTM",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [
            web3Utils.numberToHex(stakerId),
            web3Utils.numberToHex(amount)
        ]),
        chainId: OPERA_CHAIN_ID
    };
}

// what we export here
export default {
    createDelegationTx,
    increaseDelegationTx,
    claimDelegationRewardsTx,
    claimDelegationRewardsCompoundTx,
    claimValidatorRewardsTx,
    prepareToWithdrawDelegationPartTx,
    prepareToWithdrawDelegationTx,
    withdrawDelegationTx,
    withdrawPartTx,
    lockupDelegationTx,
    relockDelegationTx,
    unlockDelegationTx,
    unstashRewardsTx,
    sfcTokenizeLockedStake,
    sfcRedeemTokenizedStake
};
