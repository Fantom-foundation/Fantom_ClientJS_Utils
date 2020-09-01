import Web3 from "web3";
import web3Utils from "web3-utils";
import {AbiItem} from 'web3-utils';

// SFC_CONTRACT_ADDRESS is the address on which the SFC smart contract is deployed.
const SFC_CONTRACT_ADDRESS = '0xfc00face00000000000000000000000000000000';

// DEFAULT_GAS_LIMIT represents the maximum amount of gas we are willing
// to pay for the SFC call.
const DEFAULT_GAS_LIMIT = '0xabe0';

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
 * @param {number} amount Amount of FTM tokes to delegate.
 * @param {int} to Id of the validator to delegate to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function createDelegationTx(amount, to, web3Client) {
    // validate amount
    if (amount < 1) {
        throw 'Amount value can not be lower than minimal delegation amount.';
    }

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
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: web3Utils.numberToHex(web3Utils.toWei(amount.toString(10), "ether")),
        chainId: OPERA_CHAIN_ID,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "to",
                    "type": "uint256"
                }
            ],
            "name": "createDelegation",
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
 * @param {number} amount Amount of FTM tokes to delegate.
 * @param {int} to Id of the validator to delegate to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function increaseDelegationTx(amount, to, web3Client) {
    // validate amount
    if (!Number.isFinite(amount) || amount < 1) {
        throw 'Amount value can not be lower than minimal delegation amount.';
    }

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
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: web3Utils.numberToHex(web3Utils.toWei(amount.toString(10), "ether")),
        chainId: OPERA_CHAIN_ID,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "to",
                    "type": "uint256"
                }
            ],
            "name": "increaseDelegation",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, [web3Utils.numberToHex(to)]),
    };
}

/**
 * claimDelegationRewardsTx creates a new delegator rewards claiming transaction.
 * We have the call formatted for SFC tag 1.0.0; the 1.1.0-rc1 has
 * only one parameter here, no starting epoch.
 *
 * @param {int} maxEpochs Max number of epochs to claim.
 * @param {int} to Id of the validator to delegate to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function claimDelegationRewardsTx(maxEpochs, to, web3Client) {
    // validate staking id to be uint
    if (!Number.isInteger(maxEpochs) || (0 >= maxEpochs)) {
        throw 'Must claim at least one full epoch.';
    }

    // validate staking id
    if (to <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "maxEpochs",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "toStakerID",
                    "type": "uint256"
                }
            ],
            "name": "claimDelegationRewards",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(maxEpochs), web3Utils.numberToHex(to)]),
        chainId: OPERA_CHAIN_ID
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
    // validate staking id to be uint
    if (!Number.isInteger(maxEpochs) || (0 >= maxEpochs)) {
        throw 'Must claim at least one full epoch.';
    }

    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "maxEpochs",
                    "type": "uint256"
                }
            ],
            "name": "claimValidatorRewards",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(maxEpochs)]),
        chainId: OPERA_CHAIN_ID
    };
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
    // validate staking id
    if (to <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
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
            "name": "prepareToWithdrawDelegation",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(to)]),
        chainId: OPERA_CHAIN_ID
    };
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
 * @param {number} requestId Unique and unused identifier of the withdraw request.
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {number} amount Amount of FTM tokes to be prepared for withdraw.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function prepareToWithdrawDelegationPartTx(requestId, to, amount, web3Client) {
    // request id has to be uint
    if (!Number.isInteger(requestId) || (0 >= requestId)) {
        throw 'Request id must be a valid numeric identifier.';
    }

    // validate amount
    if (!Number.isFinite(amount) || amount < 1) {
        throw 'Amount value can not be lower than minimal withdraw amount.';
    }

    // validate staking id
    if (to <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "wrID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "toStakerID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "prepareToWithdrawDelegationPartial",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [
            web3Utils.numberToHex(requestId),
            web3Utils.numberToHex(to),
            web3Utils.numberToHex(web3Utils.toWei(amount.toString(10), "ether"))]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * withdrawPartTx creates a transaction executing partial withdraw for the given
 * prepared withdraw request.
 *
 * Note: The request id has to exist and has to be prepared for the withdraw to execute
 * correctly.
 *
 * @param {number} requestId Unique and unused identifier of the withdraw request.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function withdrawPartTx(requestId, web3Client) {
    // request id has to be uint
    if (!Number.isInteger(requestId) || (0 >= requestId)) {
        throw 'Request id must be a valid numeric identifier.';
    }

    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "wrID",
                    "type": "uint256"
                }
            ],
            "name": "partialWithdrawByRequest",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(requestId)]),
        chainId: OPERA_CHAIN_ID
    };
}


/**
 * withdrawDelegationTx creates a transaction withdrawing prepared delegation.
 *
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function withdrawDelegationTx(to, web3Client) {
    // validate staking id
    if (to <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
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
            "name": "withdrawDelegation",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(to)]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * withdrawDelegationTx creates a transaction withdrawing prepared delegation.
 *
 * @param {int} to Id of the validator the delegation belongs to.
 * @param {int} duration Number of seconds the lock should be be activated.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function lockupDelegationTx(to, duration, web3Client) {
    // validate staking id
    if (to <= 0) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate staking id to be uint
    if (!Number.isInteger(to) || (0 >= to)) {
        throw 'Validator id must be positive unsigned integer value.';
    }

    // validate minimal duration
    if (!Number.isInteger(duration) || duration < (14 * 86400)) {
        throw 'The lock duration must be at least 14 days.';
    }

    // validate maximal duration
    if (duration > (365 * 86400)) {
        throw 'The lock duration must be at most 365 days.';
    }

    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "lockDuration",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "toStakerID",
                    "type": "uint256"
                }
            ],
            "name": "lockUpDelegation",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(duration), web3Utils.numberToHex(to)]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * unstashRewardsTx creates a transaction withdrawing stashed amount on account.
 *
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function unstashRewardsTx(web3Client) {
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [],
            "name": "unstashRewards",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, []),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * ballotVote creates a transaction executing a vote on specified ballot smart contract.
 *
 * Note: The vote has to be a correct and valid ballot proposal index.
 *
 * @param {string} ballotAddress Address of the ballot smart contract.
 * @param {number} vote Index of the proposal the voter wants to choose.
 * @param {Web3|undefined} web3Client Optional instance of an initialized Web3 client.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function ballotVote(ballotAddress, vote, web3Client) {
    // vote has to be uint
    if (!Number.isInteger(vote) || (0 > vote)) {
        throw 'Vote must be a valid numeric identifier of the selected proposal.';
    }

    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: ballotAddress,
        value: ZERO_AMOUNT,
        data: encodeCall(web3Client, {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "proposal",
                    "type": "uint256"
                }
            ],
            "name": "vote",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [web3Utils.numberToHex(vote)]),
        chainId: OPERA_CHAIN_ID
    };
}

// what we export here
export default {
    createDelegationTx,
    increaseDelegationTx,
    claimDelegationRewardsTx,
    claimValidatorRewardsTx,
    prepareToWithdrawDelegationPartTx,
    prepareToWithdrawDelegationTx,
    withdrawDelegationTx,
    withdrawPartTx,
    lockupDelegationTx,
    unstashRewardsTx,
    ballotVote
};
