/**
 * This Implements Fantom Nano Ledger HW Wallet API
 *
 * @author Jiri Malek <jirka.malek@gmail.com>
 * @copyright (c) 2020, Fantom Foundation
 * @version 0.1.7
 * @licese MIT
 */
import {sign, ErrorNames} from "u2f-api";

// U2F_TIMEOUT is the number of seconds we wait for U2F to kick in
const U2F_TIMEOUT = 30;

// U2F_CHALLENGE is an arbitrary challenge used in U2F protocol.
// The Ledger U2F proxy ignores it since the actual APDU payload
// is sent via the U2F key handle.
const U2F_CHALLENGE = Buffer.from(
    "0000000000000000000000000000000000000000000000000000000000000000",
    "hex"
);

// U2F_FANTOM_MAGIC is an internal scramble key, recognized
// by the Ledger APDU proxy. It allows the APDU packet to be delivered
// correcly to the designated Fantom Nano Ledger app only. Other apps
// would receive an invalid APDU and would not accidentaly process it.
const U2F_FANTOM_MAGIC = Buffer.from("FTM", 'utf-8');

// remember the origin
let origin = "https://localhost";

/**
 * ToSafe converts input from regular base64 value to safe value
 * by replacing special characters with web safe ones.
 *
 * @param {string} input
 * @returns {string}
 */
const toSafe = (input) => input
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

/**
 * FromSafe converts input from safe base64 back to regular
 * base64 by replacing special characters with those expected in base64.
 *
 * @param {string} input
 * @returns {string}
 */
const fromSafe = (input) => input
    .replace(/-/g, "+")
    .replace(/_/g, "/") + "=="
    .substring(0, (3 * input.length) % 4);

/**
 * ScrambleApdu implements naive APDU payload encryption using
 * XOR function and preconfigured U2F_FANTOM_MAGIC
 * to ensure basic app isolation.
 *
 * @param {Buffer} apdu
 * @param {Buffer} key
 * @returns {Buffer}
 */
function scrambleApdu(apdu, key) {
    const result = Buffer.alloc(apdu.length);
    for (let i = 0; i < apdu.length; i++) {
        result[i] = apdu[i] ^ key[i % key.length];
    }
    return result;
}

/**
 * Send transmits APDU message to Ledger via U2F protocol
 * and processed the response when available.
 *
 * @param {Buffer} apdu
 * @param {number} timeout
 * @returns {Promise<Buffer>}
 */
function send(apdu, timeout) {
    // prep sign request (u2f-api sign request interface)
    const sigRequest = {
        version: "U2F_V2",
        appId: origin,
        challenge: toSafe(U2F_CHALLENGE.toString("base64")),
        keyHandle: toSafe(wrapApdu(apdu, U2F_FANTOM_MAGIC).toString("base64"))
    };

    // log the action
    console.log("Out APDU", "=>", apdu.toString("hex"));

    // send to Ledger
    return sign(sigRequest, timeout).then(response => {
        // get the main thing we came for
        const {signatureData} = response;

        // do we have the right data?
        if ("string" === typeof signatureData) {
            // decode data
            const data = Buffer.from(fromSafe(signatureData), "base64");

            // return
            const result = data.slice(5);

            // log
            console.log("In APDU", "<=", result.toString("hex"));
            return result;
        } else {
            // something wrong happened
            throw response;
        }
    });
}

/**
 * Echange APDU buffer with the Ledger device and receive the response.
 *
 * @param {Buffer} apdu
 * @returns {Promise<Buffer>}
 */
async function exchange(apdu) {
    try {
        // do the data exchange
        return await send(apdu, U2F_TIMEOUT);
    } catch (e) {
        // detect U2F error
        const isU2FError = (typeof e.metadata === "object" && e.metadata.hasOwnProperty("errorCode"));
        if (isU2FError) {
            // throw U2F error detail
            throw new Error(ErrorNames[e.metadata.errorCode]);
        } else {
            // rethrow unknown error
            throw e;
        }
    }
}

export default exchange;
