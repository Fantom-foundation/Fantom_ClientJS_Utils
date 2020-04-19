/**
 * This Implements Fantom Nano Ledger HW Wallet API
 *
 * @author Jiri Malek <jirka.malek@gmail.com>
 * @copyright (c) 2020, Fantom Foundation
 * @version 0.1.7
 * @licese MIT
 */
import {Assert, stripReturnCodeFromResponse} from "./utils";

// CLA specified service class used by Fantom Ledger application
const CLA = 0xe0;

// INS specifies instructions supported by the Fanto Ledger app
const INS = {
    GET_VERSION: 0x01,
    GET_PUBLIC_KEY: 0x10,
    GET_ADDRESS: 0x11,
    SIGN_TRANSACTION: 0x20
};

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
    return ErrorMessages[statusCode] || defaultMsg;
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
            e.message = `Ledger device: ${getErrorDescription(e.statusCode)}`;
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
            "getVersion"
        ];

        // wrap local methods within the transport layer
        // this will allow the transport layer to handle API lock and inform us
        // if another function is being resolved so we don't get into a race conditions
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
        const data = new Uint8Array(0);

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
} 
