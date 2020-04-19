import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import FantomNano from "../../lib/fantom-nano";

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

// run executes the test
async function run() {
    // inform
    console.log("Fantom Nano Ledger application example started.");
    console.log("    > We try to connect to your Ledger device.");

    // init transport adapter to Ledger device
    const tr = await TransportNodeHid.create();
    console.log("    > Ledger transport layer active.");

    // init the API bridge
    const bridge = new FantomNano(tr);

    // start executing the code
    await showVersion(bridge);
}

// do it
run().then(() => {
    console.log("Done.");
});
