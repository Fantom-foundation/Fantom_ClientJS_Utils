import web3Utils from "web3-utils";

// SFC_CONTRACT_ADDRESS is the address on which the SFC smart contract is deployed.
const SFC_CONTRACT_ADDRESS = '0xfc00face00000000000000000000000000000000';

// DEFAULT_GAS_LIMIT represents the maximum amout of gas we are willing
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
// NOTE: We have the calls hashed for SFC tag 1.0.0!
const SFC_FUNCTIONS = {
    CREATE_STAKE: '0xcc8c2120', // createStake(bytes metadata)
    CREATE_DELEGATION: '0xc312eb07', // createDelegation(uint256 to)
    CLAIM_DELEGATOR_REWARDS: '0xf99837e6', // claimDelegationRewards(uint256 _fromEpoch, uint256 maxEpochs)
    CLAIM_VALIDATOR_REWARDS: '0xf0f947c8', // claimValidatorRewards(uint256 _fromEpoch, uint256 maxEpochs)
    INCREASE_STAKE: '0xd9e257ef', // increaseStake()
    PREP_DELEGATION_WITHDRAW: '0x1c333318', // PrepareToWithdrawDelegation()
    PREP_STAKE_WITHDRAW: '0xc41b6405', // prepareToWithdrawStake()
    WITHDRAW_DELEGATION: '0x16bfdd81', // withdrawDelegation()
    WITHDRAW_STAKE: '0xbed9d861'  // withdrawStake()
};

/**
 * Format a parametrized SFC call.
 * We expect all parameters to be uint256 for now, no other params are needed so far.
 *
 * @param {string} hash SFC function hash.
 * @param {[number]} params List of parameters to be added to the call.
 * @return {string}
 */
function formatCall(hash, params) {
    let result = hash;
    if (Array.isArray(params) && (0 < params.length)) {
        result = params.reduce((previous, value) => previous + web3Utils.leftPad(value, UINT256_LEFT_PAD).replace(/^0x/i, ''), hash);
    }
    return result;
}

/**
 * createDelegationTx creates a new delegation transaction structure for the given amount and validator index.
 *
 * @param {number} amount
 * @param {int} to
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
        data: formatCall(SFC_FUNCTIONS.CREATE_DELEGATION, [to]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * claimDelegationRewardsTx creates a new delegator rewards claiming transaction.
 * We have the call formatted for SFC tag 1.0.0; the 1.1.0-rc1 has
 * only one parameter here, no starting epoch.
 *
 * @param {int} maxEpochs
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
        data: formatCall(SFC_FUNCTIONS.CLAIM_DELEGATOR_REWARDS, [0, maxEpochs]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * claimValidatorRewardsTx creates a new validator rewards claiming transaction.
 * We have the call formatted for SFC tag 1.0.0; the 1.1.0-rc1 has
 * only one parameter here, no starting epoch.
 *
 * @param {number} maxEpochs
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
        data: formatCall(SFC_FUNCTIONS.CLAIM_VALIDATOR_REWARDS, [0, maxEpochs]),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * prepareToWithdrawDelegationTx creates a transaction preparing delegations to be withdrawn.
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

// what we export here
export default {
    createDelegationTx,
    claimDelegationRewardsTx,
    claimValidatorRewardsTx,
    prepareToWithdrawDelegationTx,
    withdrawDelegationTx
};
