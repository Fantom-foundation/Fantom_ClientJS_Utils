// import needed libs
import Web3 from 'web3';

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';

/**
 * governanceVote creates a contract call transaction to post a vote
 * to the governance contract.
 *
 * @param {Web3} web3
 * @param {string} govAddress
 * @param {string} delegatedTo For self-delegation use the sender address.
 * @param {string|{BN}} proposalId
 * @param {[string|{BN}]} choices
 * @returns {{data: string, to: *, value: string}}
 */
function governanceVote(
    web3,
    govAddress,
    delegatedTo,
    proposalId,
    choices
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        to: govAddress,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "delegatedTo",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "proposalID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256[]",
                    "name": "choices",
                    "type": "uint256[]"
                }
            ],
            "name": "vote",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [delegatedTo, proposalId, choices])
    };
}

/**
 * governanceCancelVote creates a contract call transaction to cancel
 * a vote user previously posted towards a given proposal.
 *
 * @param {Web3} web3
 * @param {string} govAddress
 * @param {string} delegatedTo For self-delegation use the sender address.
 * @param {string|{BN}} proposalId
 * @returns {{data: string, to: *, value: string}}
 */
function governanceCancelVote(
    web3,
    govAddress,
    delegatedTo,
    proposalId
) {
    // create web3 instance if needed
    if (null === web3) {
        web3 = new Web3();
    }

    // make the transaction
    return {
        to: govAddress,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "delegatedTo",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "proposalID",
                    "type": "uint256"
                }
            ],
            "name": "cancelVote",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [delegatedTo, proposalId])
    };
}

// what we export here
export default {
    governanceVote,
    governanceCancelVote
};
