// import needed libs
import Web3 from "web3";
import web3Utils from "web3-utils";

// DEFAULT_GAS_LIMIT represents the maximum amount of gas we are willing
// to pay for the DeFi calls.
const DEFAULT_GAS_LIMIT = '0x2dc6c0';

// ZERO_AMOUNT represents zero amount transferred on some calls.
const ZERO_AMOUNT = '0x0';

// OPERA_CHAIN_ID is the chain id used by Fantom Opera blockchain.
const OPERA_CHAIN_ID = '0xfa';

// TESTNET_CHAIN_ID is the chain id used by Fantom Opera test net.
const TESTNET_CHAIN_ID = '0xfa2';

/**
 * defiWrapFtm creates a contract call transaction to wrap given amount
 * of native FTM tokens into the wFTM tokens used among DeFi protocols.
 *
 * @param {string} erc20Address
 * @param {string|{BN}} amount
 * @returns {{gasLimit: string, data: string, chainId: string, to: *, nonce: undefined, value: string, gasPrice: undefined}}
 */
function defiWrapFtm(erc20Address, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: erc20Address,
        value: web3Utils.numberToHex(amount),
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [],
            "name": "deposit",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, []),
        chainId: OPERA_CHAIN_ID
    };
}

/**
 * defiWrapFtm creates a contract call transaction to unwrap given amount
 * of wrapped wFTM tokens used among DeFi protocols back to the native FTM tokens.
 *
 * @param {string} erc20Address
 * @param {string|{BN}} amount
 * @returns {{gasLimit: string, data: string, chainId: string, to: *, nonce: undefined, value: string, gasPrice: undefined}}
 */
function defiUnwrapFtm(erc20Address, amount) {
    // create web3.js instance
    const web3 = new Web3();

    // make the transaction
    return {
        nonce: undefined,
        gasPrice: undefined,
        gasLimit: DEFAULT_GAS_LIMIT,
        to: erc20Address,
        value: ZERO_AMOUNT,
        data: web3.eth.abi.encodeFunctionCall({
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
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
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, [amount]),
        chainId: OPERA_CHAIN_ID
    };
}

// what we export here
export default {
    defiWrapFtm,
    defiUnwrapFtm,
    OPERA_CHAIN_ID,
    TESTNET_CHAIN_ID
};
