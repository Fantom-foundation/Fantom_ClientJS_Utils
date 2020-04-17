/**
 * This Implements Fantom Nano Ledger HW Wallet API
 *
 * @author Jiri Malek <jirka.malek@gmail.com>
 * @copyright (c) 2020, Fantom Foundation
 * @version 0.1.7
 * @licese MIT
 */
import {sign, ErrorNames} from "u2f-api";

// U2F_CHALLENGE is an arbitrary challenge used in U2F protocol.
// The Ledger U2F proxy ignores it since the actual APDU payload
// is sent via the U2F key handle.
const U2F_CHALLENGE = new Uint8Array(32);

// U2F_FANTOM_MAGIC is an internal scramble key, recognized
// by the Ledger APDU proxy (FTM). It allows the APDU packet to be delivered
// correctly to the designated Fantom Nano Ledger app only. Other apps
// would receive an invalid APDU and would not accidentally process it.
const U2F_FANTOM_MAGIC = Uint8Array.of(0x46, 0x54, 0x4d);

// bufferToBase64 converts buffer to BASE64 encoded string.
const bufferToBase64 = (buf) => {
    const bin = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(bin);
};

// base64ToBuffer converts Base64 encoded string into a TypedArray buffer.
const base64ToBuffer = (base64) => {
    const bin = atob(base64);
    const buf = new Uint8Array(bin.length);
    Array.prototype.forEach.call(bin, function (ch, i) {
        buf[i] = ch.charCodeAt(0);
    });
    return buf;
};

// buffer2Hex converts Uint8Array buffer into a hes string.
const buffer2Hex = (buffer) => {
    return Array
        .from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
};

/**
 * ToSafe converts input from regular base64 value to safe value
 * by replacing special characters with web safe ones.
 *
 * @param {Uint8Array} input
 * @returns {string}
 */
const toSafe = (input) => bufferToBase64(input)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

/**
 * FromSafe converts input from safe base64 back to regular
 * base64 by replacing special characters with those expected in base64.
 *
 * @param {string} input
 * @returns {Uint8Array}
 */
const fromSafe = (input) => base64ToBuffer(input
    .replace(/-/g, "+")
    .replace(/_/g, "/") + "=="
    .substring(0, (3 * input.length) % 4));

/**
 * ScrambleApdu implements naive APDU payload encryption using
 * XOR function and preconfigured U2F_FANTOM_MAGIC
 * to ensure basic app isolation.
 *
 * @param {Uint8Array} apdu
 * @param {Uint8Array} key
 * @returns {Uint8Array}
 */
function scrambleApdu(apdu, key) {
    const result = new Uint8Array(apdu.length);
    for (let i = 0; i < apdu.length; i++) {
        result[i] = apdu[i] ^ key[i % key.length];
    }
    return result;
}

/**
 * SendApdu transmits APDU message to Ledger via U2F protocol
 * and processed the response when available.
 *
 * @param {Uint8Array} apdu
 * @param {string} origin
 * @param {number} timeout
 * @returns {Promise<Uint8Array>}
 */
function sendApdu(apdu, origin, timeout) {
    // prep sign request (u2f-api sign request interface)
    const sigRequest = {
        version: "U2F_V2",
        appId: origin,
        challenge: toSafe(U2F_CHALLENGE),
        keyHandle: toSafe(scrambleApdu(apdu, U2F_FANTOM_MAGIC))
    };

    // log the action
    console.log("Out APDU", "=>", buffer2Hex(apdu));

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
            console.log("In APDU", "<=", buffer2Hex(result));
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
 * @param {Uint8Array} apdu
 * @param {string} origin
 * @param {number} timeout
 * @returns {Promise<Uint8Array>}
 */
export default async function send(apdu, origin, timeout) {
    try {
        // do the data exchange
        return await sendApdu(apdu, origin, timeout);
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
