// BIP32_HARDENED specifies BIP32 path element which is to be hardened.
export const BIP32_HARDENED = 0x80000000;

// MAX_FTM_TRANSFER_STR represents maximum amount of FTM tokens (in WEI units) transferable by a transaction.
const MAX_FTM_TRANSFER_STR = ["2", "284", "136", "835", "000000000000000000"].join("");

// REQUIRED_TX_ATTRIBUTES represents a list of object attributes we require
// on an outgoing transaction
const REQUIRED_TX_ATTRIBUTES = [
    "nonce", "gasPrice", "gasLimit", "value"
];

// Assert implements set of assertions used to validate data
// before being processed
export const Assert = {
    // Generic check
    check: (cond) => {
        if (!cond) {
            throw new Error("Data validation failed!");
        }
    },

    // isString validates if the given data set is a string
    isObject: (data) => {
        Assert.check("object" === typeof data);
    },

    // isString validates if the given data set is a string
    isString: (data) => {
        Assert.check("string" === typeof data);
    },

    // isInteger validates that the give data is an integer number
    isInteger: (data) => {
        Assert.check(Number.isInteger(data));
    },

    // isArray validates that the given data is an array
    isArray: (data) => {
        Assert.check(Array.isArray(data));
    },

    // isBuffer validates that the given data is a buffer
    isBuffer: (data) => {
        Assert.check(Buffer.isBuffer(data));
    },

    // isUint8 validates that the given data is an unsigned 8 bits integer value
    isUint8: (data) => {
        Assert.isInteger(data);
        Assert.check(data >= 0);
        Assert.check(data <= 255);
    },

    // isUint32 validates that the give data is an unsigned 32 bits integer value
    isUint32: (data) => {
        Assert.isInteger(data);
        Assert.check(data >= 0);
        Assert.check(data <= 4294967295);
    },

    // isHexString validates that the data is a string containing a hexadecimal number
    isHexString: (data) => {
        Assert.isString(data);
        Assert.check(0 === data.length % 2);
        Assert.check(/^[0-9a-fA-F]*$/.test(data));
    },

    // hasAttribute validates that given object does have a specified attribute
    hasAttribute: (obj, attr) => {
        Assert.isObject(obj);
        Assert.check(obj.hasOwnProperty(attr));
    },

    // isValidBip32Path validates give array for the BIP32 path validity
    isValidBip32Path: (path) => {
        Assert.isArray(path);
        for (const x of path) {
            Assert.isUint32(x);
        }

        // check for prefixes
        Assert.check(path[0] === BIP32_HARDENED | 44);
        Assert.check(path[1] === BIP32_HARDENED | 60);

        // account key is also expected to be hardened
        Assert.check(path[2] >= BIP32_HARDENED);
    },

    // isValidTransaction validates transaction for needed data elements
    isValidTransaction: (tx) => {
        // it could be the Transaction object itself
        if ("object" === typeof tx && tx.hasOwnProperty("raw") && Array.isArray(tx.raw)) {
            return
        }

        // validate fields
        for (let i = 0; i < REQUIRED_TX_ATTRIBUTES.length; i++) {
            Assert.hasAttribute(tx, REQUIRED_TX_ATTRIBUTES [i]);
        }
    }
};

/**
 * buffer2Hex implements buffer conversion to hexadecimal string
 *
 * @param {Buffer} buffer
 * @returns {string}
 */
export function buffer2Hex(buffer) {
    return Array
        .from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * hex2Buffer creates a buffer from HEX string
 *
 * @param {string} data
 * @returns {Buffer}
 */
export function hex2Buffer(data) {
    Assert.isString(data);
    return Buffer.from(data, "hex");
}

/**
 * stripReturnCodeFromResponse slices return code from an APDU response
 * and validates the successful call
 *
 * @param {Buffer} response
 * @returns {Buffer}
 */
export function stripReturnCodeFromResponse(response) {
    // make sure the response makes sense
    Assert.isBuffer(response);
    Assert.check(response.length >= 2);

    // the return code is sent as the last part of the message
    const rtIndex = response.length - 2;
    const returnCode = response.slice(rtIndex, rtIndex + 2);

    // check if the return code indicates successful call
    // 0x9000 is the standard code for success
    if (buffer2Hex(returnCode) !== "9000") {
        throw new Error(`Invalid response status code ${buffer2Hex(returnCode)} received.`);
    }

    // return the payload without the return code
    return response.slice(0, rtIndex);
}

/**
 * bip32PathToBuffer converts BIP32 path to a buffer for sending to Ledeger device.
 *
 * @param {[]} path
 * @returns {Buffer}
 */
export function bip32PathToBuffer(path) {
    // validate the path first to be sure it's valid and expected format
    // we probably already did this already, but the export can be called externally
    Assert.isValidBip32Path(path);

    // prep target buffer
    // the output path buffer has single byte length
    // followed by 32 bit (4 bytes) Uint number for each path key
    const data = Buffer.alloc(1 + (4 * path.length));

    // write number of elements in thew path
    data.writeUInt8(path.length, 0);

    // copy path items as big endian int32 numbers
    for (let i = 0; i < path.length; i++) {
        data.writeUInt32BE(path[i], 1 + i * 4);
    }

    return data;
}

// hasHexPrefix checks if the given string does have a usual hex prefix "0x".
function hasHexPrefix(str) {
    if ("string" !== typeof str) {
        throw new Error("String parameter expected.");
    }
    return "0x" === str.slice(0, 2);
}

/**
 * stripHexPrefix removes "0x" prefix from a hex string if presented
 *
 * @param {string} str
 * @return {string}
 */
export function stripHexPrefix(str) {
    if (hasHexPrefix(str)) {
        return str.slice(2);
    }
    return str;
}

// what we export here
export default {
    // marks hardened BIP32 path member
    BIP32_HARDENED,

    // function converts buffer to hex string
    buffer2Hex,

    // function converts hex string to buffer
    hex2Buffer,

    // function converts valid BIP32 path to APDU data payload buffer
    bip32PathToBuffer,

    // stripHexPrefix removes "0x" prefix from a hex string if presented
    stripHexPrefix
};