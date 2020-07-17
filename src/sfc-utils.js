import web3Utils from "web3-utils";

// SFC_CONTRACT_ADDRESS is the address on which the SFC smart contract is deployed.
const SFC_CONTRACT_ADDRESS = '0xfc00face00000000000000000000000000000000';

// DEFAULT_GAS_LIMIT represents the maximum amount of gas we are willing
// to pay for the SFC call.
const DEFAULT_GAS_LIMIT = '0xabe0';

// UINT256_LEFT_PAD is the number of chars a uint256 number is padded
// to on SFC contract calls' params (2 chars for each of the 32 bytes)
const UINT256_LEFT_PAD = 64;

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';

// OPERA_CHAIN_ID is the chain id used by Fantom Opera blockchain.
const OPERA_CHAIN_ID = '0xfa';

// SFC_FUNCTIONS represents a list of hashes of SFC contract state mutable functions
// we call using signed transactions.
// NOTE: We have the calls hashed for SFC release tag 1.1.0-rc1!
const SFC_FUNCTIONS = {
    CREATE_STAKE: '0xcc8c2120', // createStake(bytes metadata)
    CREATE_DELEGATION: '0xc312eb07', // createDelegation(uint256 to)
    CLAIM_DELEGATOR_REWARDS: '0x793c45ce', // claimDelegationRewards(uint256 maxEpochs) returns()
    CLAIM_VALIDATOR_REWARDS: '0x295cccba', // claimValidatorRewards(uint256 maxEpochs) returns()
    INCREASE_STAKE: '0xd9e257ef', // increaseStake()
    INCREASE_DELEGATION: '0x3a274ff6', // increaseDelegation() returns()
    PREP_DELEGATION_WITHDRAW_PART: '0xe7ff9e78', // prepareToWithdrawDelegationPartial(uint256 wrID, uint256 amount) returns()
    PREP_STAKE_WITHDRAW_PART: '0xc41b6405', // prepareToWithdrawStakePartial(uint256 wrID, uint256 amount) returns()
    PREP_DELEGATION_WITHDRAW: '0x1c333318', // PrepareToWithdrawDelegation()
    PREP_STAKE_WITHDRAW: '0xc41b6405', // prepareToWithdrawStake()
    WITHDRAW_DELEGATION: '0x16bfdd81', // withdrawDelegation()
    WITHDRAW_STAKE: '0xbed9d861',  // withdrawStake()
    WITHDRAW_PART_BY_REQUEST: '0xf8b18d8a',  // partialWithdrawByRequest(uint256 wrID) returns()
    UNSTASH_REWARDS: '0x876f7e2a',  // unstashRewards() returns()
    BALLOT_VOTE: '0x0121b93f' // Vote(uint256 proposal) returns ()
};

/**
 * Format a parametrized SFC call.
 * We expect all parameters to be uint256 for now, no other params are needed so far.
 *
 * @param {string} hash SFC function hash.
 * @param {[number|string]} params List of parameters to be added to the call.
 * @return {string}
 */
function formatCall(hash, params) {
    let result = hash;
    if (Array.isArray(params) && (0 < params.length)) {
        result = params.reduce((previous, value) =>
            previous + web3Utils.leftPad(value, UINT256_LEFT_PAD).replace(/^0x/i, ''),
            hash
        );
    }
    return result;
}

/**
 * createDelegationTx creates a new delegation transaction structure
 * for the given amount and validator index.
 *
 * @param {number} amount Amount of FTM tokes to delegate.
 * @param {int} to Id of the validator to delegate to.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function createDelegationTx(amount, to) {
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
        data: formatCall(SFC_FUNCTIONS.CREATE_DELEGATION, [web3Utils.numberToHex(to)]),
        chainId: OPERA_CHAIN_ID
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
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function increaseDelegationTx(amount) {
    // validate amount
    if (!Number.isFinite(amount) || amount < 1) {
        throw 'Amount value can not be lower than minimal delegation amount.';
    }

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: web3Utils.numberToHex(web3Utils.toWei(amount.toString(10), "ether")),
        data: formatCall(SFC_FUNCTIONS.INCREASE_DELEGATION, []),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * claimDelegationRewardsTx creates a new delegator rewards claiming transaction.
 * We have the call formatted for SFC tag 1.0.0; the 1.1.0-rc1 has
 * only one parameter here, no starting epoch.
 *
 * @param {int} maxEpochs Max number of epochs to claim.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function claimDelegationRewardsTx(maxEpochs) {
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
        data: formatCall(SFC_FUNCTIONS.CLAIM_DELEGATOR_REWARDS, [web3Utils.numberToHex(maxEpochs)]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * claimValidatorRewardsTx creates a new validator rewards claiming transaction.
 * We have the call formatted for SFC tag 1.0.0; the 1.1.0-rc1 has
 * only one parameter here, no starting epoch.
 *
 * @param {number} maxEpochs Max number of epochs to claim.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function claimValidatorRewardsTx(maxEpochs) {
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
        data: formatCall(SFC_FUNCTIONS.CLAIM_VALIDATOR_REWARDS, [web3Utils.numberToHex(maxEpochs)]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * prepareToWithdrawDelegationTx creates a transaction preparing delegations
 * to be withdrawn.
 *
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function prepareToWithdrawDelegationTx() {
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: formatCall(SFC_FUNCTIONS.PREP_DELEGATION_WITHDRAW, []),
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
 * @param {number} amount Amount of FTM tokes to be prepared for withdraw.
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function prepareToWithdrawDelegationPartTx(requestId, amount) {
    // request id has to be uint
    if (!Number.isInteger(requestId) || (0 >= requestId)) {
        throw 'Request id must be a valid numeric identifier.';
    }

    // validate amount
    if (!Number.isFinite(amount) || amount < 1) {
        throw 'Amount value can not be lower than minimal withdraw amount.';
    }

    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: formatCall(SFC_FUNCTIONS.PREP_DELEGATION_WITHDRAW_PART, [
            web3Utils.numberToHex(requestId),
            web3Utils.numberToHex(web3Utils.toWei(amount.toString(10), "ether"))
        ]),
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
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function withdrawPartTx(requestId) {
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
        data: formatCall(SFC_FUNCTIONS.WITHDRAW_PART_BY_REQUEST, [web3Utils.numberToHex(requestId)]),
        chainId: OPERA_CHAIN_ID
    };
}


/**
 * withdrawDelegationTx creates a transaction withdrawing prepared delegation.
 *
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function withdrawDelegationTx() {
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: formatCall(SFC_FUNCTIONS.WITHDRAW_DELEGATION, []),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * unstashRewardsTx creates a transaction withdrawing stashed amount on account.
 *
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function unstashRewardsTx() {
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: SFC_CONTRACT_ADDRESS, /* SFC Contract */
        value: ZERO_AMOUNT,
        data: formatCall(SFC_FUNCTIONS.UNSTASH_REWARDS, []),
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
 * @return {{gasLimit: string, data: string, chainId: string, to: string, nonce: undefined, value: string, gasPrice: undefined}}
 */
function ballotVote(ballotAddress, vote) {
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
        data: formatCall(SFC_FUNCTIONS.BALLOT_VOTE, [web3Utils.numberToHex(vote)]),
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
    unstashRewardsTx,
    ballotVote
};
