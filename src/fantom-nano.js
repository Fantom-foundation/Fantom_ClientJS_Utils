/**
 * This Implements Fantom Nano Ledger HW Wallet API
 *
 * @author Jiri Malek <jirka.malek@gmail.com>
 * @copyright (c) 2020, Fantom Foundation
 * @version 0.1.7
 * @licese MIT
 */
import utils from "./utils";

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

// FantomNano manages the API code to the communication primitives
export default class FantomNano {

    async getVersion() {
        // construct outgoing buffer fot the version request
        const out = Buffer.from([CLA, INS.GET_VERSION, 0x00, 0x00, 0x00]);
        let res = null;

        // send the data to device and read response
        try {
            res = await utils.send(out);
        } catch (e) {
            throw e;
        }

        return res;
    }
}