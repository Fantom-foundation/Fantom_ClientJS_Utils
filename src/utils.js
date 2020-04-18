// Assert implements set of assertions used to validate data
// before being processed
export const Assert = {
    // Generic check
    check: (cond) => {
        if (!cond) {
            throw new Error("Invalid data received!");
        }
    },

    // isString validates if the given data set is a string
    isString: (data) => {
        Assert.check(typeof data === "string");
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
