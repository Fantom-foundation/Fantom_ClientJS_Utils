import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import FantomNano from "../../lib/fantom-nano";
import {buffer2Hex} from "../../lib/utils";

/**
 * showVersion loads application version from Ledger device and dumps
 * it into the console
 *
 * @param {FantomNano} bridge
 * @returns {Promise<void>}
 */
async function showVersion(bridge) {
    // inform
    console.log("\nRequesting Fantom Nano Ledger app version.");

    // get the version info
    const ver = await bridge.getVersion();
    console.log(`    > Fantom Nano app version is: ${ver.major}.${ver.minor}.${ver.patch}`);

    // devel version?
    if (ver.flags.isDevelopment) {
        console.log("    > You have a development build installed!");
    }
}

/**
 * getPrimaryWallet gets the first wallet address of the first account
 * The address is derived on the ledger device and sent back to us through
 * the transport layer.
 *
 * @param {FantomNano} bridge
 * @returns {Promise<void>}
 */
async function getPrimaryWallet(bridge) {
    // inform
    console.log("\nRequesting primary wallet for the main account.");

    // get the version info
    const addr = await bridge.getAddress(0, 0);
    console.log(`    > Address: ${addr}`);
}

/**
 * getWalletList gets the first five wallet addresses of the first account
 * Each address is derived on the ledger device and sent back to us through
 * the transport layer.
 *
 * @param {FantomNano} bridge
 * @returns {Promise<void>}
 */
async function getWalletList(bridge) {
    // inform
    console.log("\nRequesting list of five wallets for the main account.");

    // get the version info
    const addr = await bridge.listAddresses(0, 0, 5);
    for (let i = 0; i < addr.length; i++) {
        console.log(`    > Address: ${addr[i]}`);
    }
}

/**
 * getPrimaryWalletPubKey gets the extended public key of the first wallet address
 * of the first account
 *
 * @param {FantomNano} bridge
 * @returns {Promise<void>}
 */
async function getPrimaryWalletPubKey(bridge) {
    // inform
    console.log("\nRequesting public key of the primary wallet of the main account.");

    // get the version info
    const key = await bridge.getPublicKey(0, 0);
    console.log(`    > Pub Key: ${buffer2Hex(key.publicKey)}`);
    console.log(`    > Chain Key: ${buffer2Hex(key.chainKey)}`);
}

/**
 * getSignedTransaction sends a transaction to the device for signature building
 * and returns the signed transaction data
 *
 * @param {FantomNano} bridge
 * @returns {Promise<void>}
 */
async function getSignedTransaction(bridge) {
    // inform
    console.log("\nRequesting transaction signature.");

    // prep the transaction
    const tx = {
        nonce: "0x2",
        gasPrice: "0x3b9aca00",
        gasLimit: "0xabe0",
        to: "0x76AE07E6D236c1aE3F5C3112F387ad82c69A2471", /* Sunstone */
        value: "0xde0b6b3a7640000", /* 1 FTM in WEI (1e+18) in HEX */
        // data: "0x506f6b7573", /* string Test */
        data: "0xc312eb070000000000000000000000000000000000000000000000000000000000000003",
        chainId: "0xfa"
    };

    // get the version info
    const result = await bridge.signTransaction(0, 0, tx);
    console.log(`    > Signed Raw: ${buffer2Hex(result.raw)}`);
}

// run executes the test
async function run() {
    // inform
    console.log("-----------------------------------------------");
    console.log("Fantom Nano Ledger application example started.");
    console.log("-----------------------------------------------");
    console.log("\n    > We try to connect to your Ledger device.");

    // init transport adapter to Ledger device
    const tr = await TransportNodeHid.create();
    console.log("    > Ledger transport layer active.");

    // init the API bridge
    const bridge = new FantomNano(tr);
    try {
        // start executing the code
        await showVersion(bridge);

        // get the first available address
        await getPrimaryWallet(bridge);

        // get the list of addresses
        await getWalletList(bridge);

        // get the first available address
        await getPrimaryWalletPubKey(bridge);

        // try to get signed transaction
        await getSignedTransaction(bridge);
    } catch (e) {
        console.log("Interrupted!", e.toString());
    }
}

// do it
run().then(() => {
    // we are done here
    console.log("\n-----------------------------------------------\nDone.");
});
