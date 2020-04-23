/**
 * This Implements Fantom Nano Ledger HW Wallet API
 *
 * @author Jiri Malek <jirka.malek@gmail.com>
 * @copyright (c) 2020, Fantom Foundation
 * @version 0.1.7
 * @licese MIT
 */
import {Assert, stripReturnCodeFromResponse, bip32PathToBuffer, BIP32_HARDENED, buffer2Hex} from "./utils";
import {Transaction} from "ethereumjs-tx";

// FANTOM_CHAIN_ID represents the Fantom Opera main chain id.
export const FANTOM_CHAIN_ID = 0xfa;

// CLA specified service class used by Fantom Ledger application
const CLA = 0xe0;

// INS specifies instructions supported by the Fanto Ledger app
const INS = {
    GET_VERSION: 0x01,
    GET_PUBLIC_KEY: 0x10,
    GET_ADDRESS: 0x11,
    SIGN_TRANSACTION: 0x20
};

// SIGN_STATE represents the state of transaction data processing
// on the Ledger device
const SIGN_STATE = {
    COLLECT: 0x02,
    FINALIZE: 0x04
};

// MAX_APDU_CHUNK_LENGTH represents the max amount of bytes we send
// to the device in one chunk
const MAX_APDU_CHUNK_LENGTH = 200;

// ErrorCodes exports list of errors produced by the Fantom Ledger app
// in case of unexpected event.
export const ErrorCodes = {
    // Bad request header.
    ERR_BAD_REQUEST_HEADER: 0x6E01,

    // Unknown service class CLA received.
    ERR_UNKNOWN_CLA: 0x6E02,

    // Unknown instruction arrived.
    ERR_UNKNOWN_INS: 0x6E03,

    // Request is not valid in the current context.
    ERR_INVALID_STATE: 0x6E04,

    // Request contains invalid parameters P1, P2, or Lc.
    ERR_INVALID_PARAMETERS: 0x6E05,

    // Request contains invalid payload structure, or content.
    ERR_INVALID_DATA: 0x6E06,

    // Action has been rejected by user.
    ERR_REJECTED_BY_USER: 0x6E07,

    // Action rejected by security policy.
    ERR_REJECTED_BY_POLICY: 0x6E08,

    // Device is locked.
    ERR_DEVICE_LOCKED: 0x6E09
};

// ErrorMessages exports list of english error messages associated
// with corresponding error codes.
export const ErrorMessages = {
    // Bad request header.
    [ErrorCodes.ERR_BAD_REQUEST_HEADER]: "Invalid request header sent to the hw wallet.",

    // Unknown service class CLA received.
    [ErrorCodes.ERR_UNKNOWN_CLA]: "Unknown, or rejected service class.",

    // Unknown instruction arrived.
    [ErrorCodes.ERR_UNKNOWN_INS]: "Unknown instruction sent.",

    // Request is not valid in the current context.
    [ErrorCodes.ERR_INVALID_STATE]: "Invalid instruction state.",

    // Request contains invalid parameters P1, P2, or Lc.
    [ErrorCodes.ERR_INVALID_PARAMETERS]: "Invalid instruction parameters.",

    // Request contains invalid payload structure, or content.
    [ErrorCodes.ERR_INVALID_DATA]: "Data sent with the request has not been recognized.",

    // Action has been rejected by user.
    [ErrorCodes.ERR_REJECTED_BY_USER]: "User rejected requested action.",

    // Action rejected by security policy.
    [ErrorCodes.ERR_REJECTED_BY_POLICY]: "Requested action is prohibited by security policy.",

    // Device is locked.
    [ErrorCodes.ERR_DEVICE_LOCKED]: "Can not proceed with the instruction, please unlock the device.",
};

/**
 * Get error message for the given status code.
 * If the status code is not known to the API bridge, it returns a default
 * error message with the code itself.
 *
 * @param {number} status
 * @returns {string}
 */
export const getErrorMessage = (status) => {
    const statusCodeHex = `0x${status.toString(16)}`;
    const defaultMsg = `Unknown error ${statusCodeHex}. Please consult the manual.`;
    return ErrorMessages[status] || defaultMsg;
};


/**
 * convertError implements transport layer error message conversion
 * DWE
 * we don't want to keep original and un-informative error codes so we use our
 * application aware errors instead; the conversion is done by the response code
 * of the APDU status we received
 *
 * @param {function} fn
 * @returns {function(...[*]=)}
 */
const wrapConvertError = fn => async (...args) => {
    try {
        return await fn(...args);
    } catch (e) {
        if (e && e.statusCode) {
            e.message = `Ledger device: ${getErrorMessage(e.statusCode)}`;
        }
        throw e;
    }
};


// FantomNano implements high level Fantom Nano Ledger HW wallet communication
export default class FantomNano {
    // transport represents Ledger hw-transport layer
    // used to exchange APDU stream with the Ledger device
    transport;

    // send represents a wrapped transport send function
    send;

    // methods is an array of methods supported by the API bridge
    methods;

    /**
     * Construct new FantomNano API bridge
     *
     * @param {Transport} transport
     * @param {string} ledgerAppKey APDU proxy key of the Ledger application
     */
    constructor(transport, ledgerAppKey = "FTM") {
        // keep the transport
        this.transport = transport;

        // set the list of supported methods
        this.methods = [
            "getVersion",
            "getAddress",
            "listAddresses",
            "getPublicKey",
            "signTransaction"
        ];

        // wrap local methods within the transport layer
        // this will allow the transport layer to handle API lock and inform us
        // if another function is being resolved so we don't get into a race conditions.
        // Some function require user interaction with the device and another instruction
        // can not be executed until the active one finished. If we send another APDU
        // in the mean time, the Fantom app will restart the Ledger device to protect
        // it against malicious attempts to abuse possible weaknesses of the internal
        // state switch.
        this.transport.decorateAppAPIMethods(this, this.methods, ledgerAppKey);

        // reference send function locally and wrap it in a status code
        // conversion wrapper so exceptions have app aware error messages
        this.send = wrapConvertError(this.transport.send);
    }

    /**
     * getVersion obtains Fantom Nano Ledger application version
     *
     * @returns {Promise<Version>}
     */
    async getVersion() {
        const p1 = 0x00;
        const p2 = 0x00;
        const data = Buffer.alloc(0);

        // execute the call
        return this.send(CLA, INS.GET_VERSION, p1, p2, data).then(response => {
            // extract version data
            const data = stripReturnCodeFromResponse(response);

            // make sure the response is of expected length
            // we expect {MAJOR}.{MINOR}.{PATCH}.{FLAG}
            Assert.check(4 === data.length);

            // expand the values
            const [major, minor, patch, flag] = data;
            const flags = {
                isDevelopment: (flag & 0x01)
            };

            // return the data structure
            return {major, minor, patch, flags};
        });
    }

    /**
     * getBip32Path creates a valid BIP32/44 path for given account and address.
     *
     * @param {number} accountId
     * @param {number} addressId
     * @returns {[]}
     */
    getBip32Path(accountId, addressId) {
        // make sure the account and address make sense
        Assert.isUint8(accountId);
        Assert.isUint32(addressId);

        // make the path and validate it
        const path = [44 + BIP32_HARDENED, 60 + BIP32_HARDENED, accountId + BIP32_HARDENED, 0, addressId];
        Assert.isValidBip32Path(path);

        return path;
    }

    /**
     * getAddress extracts Fantom wallet address for the given account and address id.
     *
     * @param {number} accountId Zero based account identifier.
     * @param {number} addressId Zero based address identifier.
     * @returns {Promise<string>}
     */
    async getAddress(accountId = 0, addressId = 0, confirmAddress = true) {
        // derive address for the BIP44 path constructed for the given account and address
        return this.deriveAddress(this.getBip32Path(accountId, addressId), confirmAddress);
    }

    /**
     * listAddresses extracts sequence of logically consequent Fantom wallet addresses
     * for the given account, initial address id and expected address length.
     *
     * Please note that user will be warned if you ask for an address range exceeding
     * 1000000 address index.
     *
     * @param {number} accountId Zero based account identifier.
     * @param {number} firstAddressId Zero based id of the first address we want to start with.
     * @param {number} length The number of addresses we need
     * @returns {Promise<[]>}
     */
    async listAddresses(accountId = 0, firstAddressId = 0, length = 5) {
        const result = [];
        Assert.isUint32(firstAddressId);
        Assert.isUint8(length);
        Assert.check(length > 0);

        // build list of paths
        const paths = [];
        for (let i = 0; i < length; i++) {
            paths.push(this.getBip32Path(accountId, firstAddressId + i));
        }

        // requests derived addresses for the paths
        const lastPath = await paths.reduce(async (previous, next) => {
            // wait for the address to arrive
            const res = await previous;
            if (null !== res) {
                result.push(res);
            }

            // ask for the next address
            return this.deriveAddress(next, false);
        }, Promise.resolve(null));

        // also store the last path
        if (null !== lastPath) {
            result.push(lastPath);
        }

        // return the result
        return result;
    }

    /**
     * getPublicKey derives Fantom wallet public key for the given account and address id.
     *
     * @param {number} accountId Zero based account identifier.
     * @param {number} addressId Zero based address identifier.
     * @returns {Promise<{}>}
     */
    async getPublicKey(accountId = 0, addressId = 0) {
        // derive address for the BIP44 path constructed for the given account and address
        return this.derivePublicKey(this.getBip32Path(accountId, addressId));
    }

    /**
     * signTransaction signs specified transaction on the Ledger device and return signed transaction data.
     *
     * @param {number} accountId Zero based sending account identifier.
     * @param {number} addressId Zero based sending address identifier.
     * @param {{}|Transaction} tx Transaction details. Please check the documentation for the structure.
     * @returns {Promise<{}>}
     */
    async signTransaction(accountId, addressId, tx) {
        // validate transaction
        Assert.isValidTransaction(tx);

        // step 1: Init signing process on the device
        const step1Init = async (bip32Path) => {
            // make sure the path is valid;
            // we may skip this here, but we want some sanity checks
            Assert.isValidBip32Path(bip32Path);

            // what params will be sent
            const p1 = 0x00;
            const p2 = 0x00;
            const data = bip32PathToBuffer(bip32Path);

            // execute the call
            return this.send(CLA, INS.SIGN_TRANSACTION, p1, p2, data).then(response => {
                // extract version data
                const data = stripReturnCodeFromResponse(response);

                // the data should be actually empty
                Assert.check(data.length === 0);
                return true;
            });
        };

        // step 2: transfer the transaction data to the device
        const step2TxTransfer = async (chunk) => {
            // what params will be sent
            const p1 = 0x01;
            const p2 = 0x00;

            // send the RLP encoded transaction chunk to the device
            return await this.send(CLA, INS.SIGN_TRANSACTION, p1, p2, chunk).then(response => {
                // extract version data
                const data = stripReturnCodeFromResponse(response);

                // the data should contain current processing stage
                // it's either SIGN_STAGE_COLLECT (0x02), or SIGN_STAGE_FINALIZE (0x04)
                Assert.check(data.length === 1);
                Assert.check(data[0] === SIGN_STATE.COLLECT || data[0] === SIGN_STATE.FINALIZE);

                // return the signature state
                return data[0];
            });
        };

        // step 3: finish the signing process by obtaining the signature parts
        const step3TxFinalize = async () => {
            // what params will be sent
            const p1 = 0x80;
            const p2 = 0x00;
            const data = Buffer.alloc(0);

            // send the RLP encoded transaction chunk to the device
            return await this.send(CLA, INS.SIGN_TRANSACTION, p1, p2, data).then(response => {
                // extract version data
                const data = stripReturnCodeFromResponse(response);

                // we expect following structure
                // 1 byte for <v> value
                // 32 bytes for <r> value
                // 32 bytes for <s> value
                Assert.check(data.length === 1 + 32 + 32);

                // get the signature details
                return {
                    v: new Uint8Array(data.slice(0, 1))[0],
                    r: data.slice(1, 33),
                    s: data.slice(33, 65),
                };
            });
        };

        // prepare the transaction buffer for sending
        let buffer;
        if ("object" === typeof tx && tx.hasOwnProperty("raw") && Array.isArray(tx.raw)) {
            // we use direct conversion
            buffer = tx.serialize();
        } else {
            // we make the intermediate for LRP encoding
            const trx = new Transaction(tx, {});
            buffer = trx.serialize();
        }

        // make chunks for sending to ledger device
        // we potentially have to split the data for U2F transport
        const chunks = [];
        const parts = Math.ceil(buffer.length / MAX_APDU_CHUNK_LENGTH);
        for (let i = 0; i < parts; i++) {
            chunks [i] = buffer.slice(i * MAX_APDU_CHUNK_LENGTH, (i + 1) * MAX_APDU_CHUNK_LENGTH);
        }

        // initialize the signing process first
        await step1Init(this.getBip32Path(accountId, addressId));

        // transfer chunks of data one by one
        await chunks.reduce(async (previous, next) => {
            // wait for the previous to finish
            const res = await previous;

            // we may not need to transfer the last chunk if the Ledger already signalled that it doesn't
            // need it (probably because the last chunk has only empty v, r, and s values
            if (SIGN_STATE.COLLECT === res) {
                return step2TxTransfer(next);
            } else {
                return Promise.resolve(SIGN_STATE.FINALIZE);
            }
        }, Promise.resolve(SIGN_STATE.COLLECT));

        // confirm signature processing on the device and request
        // the signature data to be returned
        const sig = await step3TxFinalize();

        // add the signature to the transaction
        const txFinal = new Transaction({v: sig.v, r: sig.r, s: sig.s, ...tx}, {});
        return {
            v: sig.v,
            r: sig.r,
            s: sig.s,
            tx: txFinal,
            raw: txFinal.serialize()
        }
    }

    /**
     * deriveAddress derives address for the given BIP32 path.
     *
     * Please note that the Fantom Ledger application is coded to provide
     * only subset of BIP32 paths with prefix "44'/60'". We don't derive
     * addresses outside of expected Fantom address space.
     *
     * @param {[]} bip32Path
     * @param {boolean} confirmAddress
     * @returns {Promise<string>}
     */
    async deriveAddress(bip32Path, confirmAddress) {
        // check the path for validity
        Assert.isValidBip32Path(bip32Path);

        // what params will be sent
        const p1 = (confirmAddress ? 0x02 : 0x01);
        const p2 = 0x00;
        const data = bip32PathToBuffer(bip32Path);

        // execute the call
        return this.send(CLA, INS.GET_ADDRESS, p1, p2, data).then(response => {
            // extract version data
            const data = stripReturnCodeFromResponse(response);

            // make sure the response is of expected length
            // we expect 1 byte for address length + (probably) 20 bytes address buffer
            Assert.check(0 < data.length);

            // get the address length
            const len = new Uint8Array(data.slice(0, 1))[0];

            // do we have the data we expect
            Assert.check(0 < len);
            Assert.check(len + 1 === data.length);

            // return the address data as an expected hex string
            return "0x" + buffer2Hex(data.slice(1, 1 + len));
        });
    }

    /**
     * derivePublicKey derives public key for the given BIP32 path.
     *
     * Please note that the Fantom Ledger application is coded to provide
     * only subset of BIP32 paths with prefix "44'/60'". We don't derive
     * public keys outside of expected Fantom address space.
     *
     * @param bip32Path
     * @returns {Promise<{}>}
     */
    async derivePublicKey(bip32Path) {
        // check the path for validity
        Assert.isValidBip32Path(bip32Path);

        // what params will be sent
        const p1 = 0x00;
        const p2 = 0x00;
        const data = bip32PathToBuffer(bip32Path);

        // execute the call
        return this.send(CLA, INS.GET_PUBLIC_KEY, p1, p2, data).then(response => {
            // extract version data
            const data = stripReturnCodeFromResponse(response);

            // make sure the response is of expected length
            // we expect 1 byte for public key length + that amount of bytes for the
            // public key + that same amount of bytes for the chain key
            Assert.check(0 < data.length);

            // get the public key length
            const len = new Uint8Array(data.slice(0, 1))[0];

            // do we have the data we expect?
            // length byte + 2 x length of key bytes
            Assert.check(1 + len + len === data.length);

            // return the data
            return {
                publicKey: data.slice(1, 1 + len),
                chainKey: data.slice(1 + len, 1 + len + len)
            };
        });
    }
}
