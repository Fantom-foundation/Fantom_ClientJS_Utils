const expect = require('chai').expect;
const sfc_utils = require('../lib/sfc-utils');
const defi_utils = require('../lib/defi-utils');

// test the SFC transactions creation
describe('SFC Transaction Builder', () => {
    // create new delegation
    describe('create new delegation', () => {
        // create the transaction
        const tx = sfc_utils.default.createDelegationTx(123758431.5578147, 173898);

        it('should be correct SFC address', () => {
            expect(tx.to).to.equal('0xfc00face00000000000000000000000000000000');
        });

        it('should be correct Opera chain', () => {
            expect(tx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(tx.value).to.equal('0x665ede04965807fe19b800');
        });

        it('should be expected gas amount', () => {
            expect(tx.gasLimit).to.equal('0xabe0');
        });

        it('should have correct serialized call input', () => {
            expect(tx.data).to.equal('0xc312eb07000000000000000000000000000000000000000000000000000000000002a74a');
        });

        it('should reject negative amount', () => {
            expect(sfc_utils.default.createDelegationTx.bind(sfc_utils.default, -1, 17)).to.throw('Amount value can not be lower than minimal delegation amount.');
        });

        it('should reject zero amount', () => {
            expect(sfc_utils.default.createDelegationTx.bind(sfc_utils.default, 0, 17)).to.throw('Amount value can not be lower than minimal delegation amount.');
        });

        it('should reject small amount', () => {
            expect(sfc_utils.default.createDelegationTx.bind(sfc_utils.default, 0.95, 17)).to.throw('Amount value can not be lower than minimal delegation amount.');
        });

        it('should reject negative validator id', () => {
            expect(sfc_utils.default.createDelegationTx.bind(sfc_utils.default, 1, -1)).to.throw('Validator id must be positive unsigned integer value.');
        });

        it('should reject zero validator id', () => {
            expect(sfc_utils.default.createDelegationTx.bind(sfc_utils.default, 1, 0)).to.throw('Validator id must be positive unsigned integer value.');
        });

        it('should reject invalid validator id', () => {
            expect(sfc_utils.default.createDelegationTx.bind(sfc_utils.default, 1, 1.5)).to.throw('Validator id must be positive unsigned integer value.');
        });
    });

    // increase delegation
    describe('increase delegation amount', () => {
        // create the transaction
        const tx = sfc_utils.default.increaseDelegationTx(123456.654321);

        it('should be correct SFC address', () => {
            expect(tx.to).to.equal('0xfc00face00000000000000000000000000000000');
        });

        it('should be correct Opera chain', () => {
            expect(tx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(tx.value).to.equal('0x1a2499408b8fb7141000');
        });

        it('should be expected gas amount', () => {
            expect(tx.gasLimit).to.equal('0xabe0');
        });

        it('should have correct serialized call input', () => {
            expect(tx.data).to.equal('0x3a274ff6');
        });

        it('should reject negative amount', () => {
            expect(sfc_utils.default.increaseDelegationTx.bind(sfc_utils.default, -1)).to.throw('Amount value can not be lower than minimal delegation amount.');
        });

        it('should reject zero amount', () => {
            expect(sfc_utils.default.increaseDelegationTx.bind(sfc_utils.default, 0)).to.throw('Amount value can not be lower than minimal delegation amount.');
        });

        it('should reject small amount', () => {
            expect(sfc_utils.default.increaseDelegationTx.bind(sfc_utils.default, 0.95)).to.throw('Amount value can not be lower than minimal delegation amount.');
        });
    });

    // claim delegation rewards
    describe('claim delegation rewards', () => {
        // create the transaction
        const tx = sfc_utils.default.claimDelegationRewardsTx(2174);

        it('should be correct SFC address', () => {
            expect(tx.to).to.equal('0xfc00face00000000000000000000000000000000');
        });

        it('should be correct Opera chain', () => {
            expect(tx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(tx.value).to.equal('0x0');
        });

        it('should be expected gas amount', () => {
            expect(tx.gasLimit).to.equal('0xabe0');
        });

        it('should have correct serialized call input', () => {
            expect(tx.data).to.equal('0x793c45ce000000000000000000000000000000000000000000000000000000000000087e');
        });

        it('should reject negative epochs', () => {
            expect(sfc_utils.default.claimDelegationRewardsTx.bind(sfc_utils.default, -1)).to.throw('Must claim at least one full epoch.');
        });

        it('should reject zero epochs', () => {
            expect(sfc_utils.default.claimDelegationRewardsTx.bind(sfc_utils.default, 0)).to.throw('Must claim at least one full epoch.');
        });

        it('should reject decimal epochs', () => {
            expect(sfc_utils.default.claimDelegationRewardsTx.bind(sfc_utils.default, 5.2)).to.throw('Must claim at least one full epoch.');
        });
    });

    // claim validation rewards
    describe('claim validation rewards', () => {
        // create the transaction
        const tx = sfc_utils.default.claimValidatorRewardsTx(3485);

        it('should be correct SFC address', () => {
            expect(tx.to).to.equal('0xfc00face00000000000000000000000000000000');
        });

        it('should be correct Opera chain', () => {
            expect(tx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(tx.value).to.equal('0x0');
        });

        it('should be expected gas amount', () => {
            expect(tx.gasLimit).to.equal('0xabe0');
        });

        it('should have correct serialized call input', () => {
            expect(tx.data).to.equal('0x295cccba0000000000000000000000000000000000000000000000000000000000000d9d');
        });

        it('should reject negative epochs', () => {
            expect(sfc_utils.default.claimValidatorRewardsTx.bind(sfc_utils.default, -1)).to.throw('Must claim at least one full epoch.');
        });

        it('should reject zero epochs', () => {
            expect(sfc_utils.default.claimValidatorRewardsTx.bind(sfc_utils.default, 0)).to.throw('Must claim at least one full epoch.');
        });

        it('should reject decimal epochs', () => {
            expect(sfc_utils.default.claimValidatorRewardsTx.bind(sfc_utils.default, 5.2)).to.throw('Must claim at least one full epoch.');
        });
    });

    // prepare to withdraw delegation
    describe('prepare to withdraw delegation', () => {
        // create the transaction
        const tx = sfc_utils.default.prepareToWithdrawDelegationTx();

        it('should be correct SFC address', () => {
            expect(tx.to).to.equal('0xfc00face00000000000000000000000000000000');
        });

        it('should be correct Opera chain', () => {
            expect(tx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(tx.value).to.equal('0x0');
        });

        it('should be expected gas amount', () => {
            expect(tx.gasLimit).to.equal('0xabe0');
        });

        it('should have correct serialized call input', () => {
            expect(tx.data).to.equal('0x1c333318');
        });
    });

    // prepare to withdraw delegation partially
    describe('prepare to partially withdraw delegation', () => {
        // create the transaction
        const tx = sfc_utils.default.prepareToWithdrawDelegationPartTx(1178921, 123456.654321);

        it('should be correct SFC address', () => {
            expect(tx.to).to.equal('0xfc00face00000000000000000000000000000000');
        });

        it('should be correct Opera chain', () => {
            expect(tx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(tx.value).to.equal('0x0');
        });

        it('should be expected gas amount', () => {
            expect(tx.gasLimit).to.equal('0xabe0');
        });

        it('should have correct serialized call input', () => {
            expect(tx.data).to.equal('0xe7ff9e78000000000000000000000000000000000000000000000000000000000011fd29000000000000000000000000000000000000000000001a2499408b8fb7141000');
        });

        it('should reject negative amount', () => {
            expect(sfc_utils.default.prepareToWithdrawDelegationPartTx.bind(sfc_utils.default, 1178921, -1)).to.throw('Amount value can not be lower than minimal withdraw amount.');
        });

        it('should reject zero amount', () => {
            expect(sfc_utils.default.prepareToWithdrawDelegationPartTx.bind(sfc_utils.default, 1178921, 0)).to.throw('Amount value can not be lower than minimal withdraw amount.');
        });

        it('should reject small amount', () => {
            expect(sfc_utils.default.prepareToWithdrawDelegationPartTx.bind(sfc_utils.default, 1178921, 0.95)).to.throw('Amount value can not be lower than minimal withdraw amount.');
        });

        it('should reject negative request id', () => {
            expect(sfc_utils.default.prepareToWithdrawDelegationPartTx.bind(sfc_utils.default, -1, 73)).to.throw('Request id must be a valid numeric identifier.');
        });

        it('should reject zero request id', () => {
            expect(sfc_utils.default.prepareToWithdrawDelegationPartTx.bind(sfc_utils.default, 0, 73)).to.throw('Request id must be a valid numeric identifier.');
        });

        it('should reject non-integer request id', () => {
            expect(sfc_utils.default.prepareToWithdrawDelegationPartTx.bind(sfc_utils.default, 1.25, 73)).to.throw('Request id must be a valid numeric identifier.');
        });
    });

    // withdraw delegation
    describe('execute delegation withdraw', () => {
        // create the transaction
        const tx = sfc_utils.default.withdrawDelegationTx();

        it('should be correct SFC address', () => {
            expect(tx.to).to.equal('0xfc00face00000000000000000000000000000000');
        });

        it('should be correct Opera chain', () => {
            expect(tx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(tx.value).to.equal('0x0');
        });

        it('should be expected gas amount', () => {
            expect(tx.gasLimit).to.equal('0xabe0');
        });

        it('should have correct serialized call input', () => {
            expect(tx.data).to.equal('0x16bfdd81');
        });
    });

    // withdraw delegation
    describe('execute partial delegation withdraw', () => {
        // create the transaction
        const tx = sfc_utils.default.withdrawPartTx(737373111737373);

        it('should be correct SFC address', () => {
            expect(tx.to).to.equal('0xfc00face00000000000000000000000000000000');
        });

        it('should be correct Opera chain', () => {
            expect(tx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(tx.value).to.equal('0x0');
        });

        it('should be expected gas amount', () => {
            expect(tx.gasLimit).to.equal('0xabe0');
        });

        it('should have correct serialized call input', () => {
            expect(tx.data).to.equal('0xf8b18d8a00000000000000000000000000000000000000000000000000029ea30e645c1d');
        });

        it('should reject negative request id', () => {
            expect(sfc_utils.default.withdrawPartTx.bind(sfc_utils.default, -1)).to.throw('Request id must be a valid numeric identifier.');
        });

        it('should reject zero request id', () => {
            expect(sfc_utils.default.withdrawPartTx.bind(sfc_utils.default, 0)).to.throw('Request id must be a valid numeric identifier.');
        });

        it('should reject non-integer request id', () => {
            expect(sfc_utils.default.withdrawPartTx.bind(sfc_utils.default, 1.25)).to.throw('Request id must be a valid numeric identifier.');
        });
    });

    // deposit DeFi
    describe('DeFi deposit tokens tx builder', () => {
        // create a native and non-native token tx
        const nativeTx = defi_utils.default.defiDepositTokenTx('0xabababababababababababababababababababac', '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', '250000000');
        const synthTx = defi_utils.default.defiDepositTokenTx('0xabababababababababababababababababababac', '0xacacacacacacacacacacacacacacacacacacacad', '300000000');

        it('should be correct DeFi contract address', () => {
            expect(nativeTx.to).to.equal('0xabababababababababababababababababababac');
            expect(synthTx.to).to.equal('0xabababababababababababababababababababac');
        });

        it('should be correct Opera chain', () => {
            expect(nativeTx.chainId).to.equal('0xfa');
            expect(synthTx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(nativeTx.value).to.equal('0xee6b280');
            expect(synthTx.value).to.equal('0x0');
        });

        it('should have correct serialized call input', () => {
            expect(nativeTx.data).to.equal('0x47e7ef24000000000000000000000000ffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000ee6b280');
            expect(synthTx.data).to.equal('0x47e7ef24000000000000000000000000acacacacacacacacacacacacacacacacacacacad0000000000000000000000000000000000000000000000000000000011e1a300');
        });
    });

    // withdraw DeFi
    describe('DeFi withdraw tokens tx builder', () => {
        // create a native and non-native token tx
        const nativeTx = defi_utils.default.defiWithdrawDepositedTokenTx('0xabababababababababababababababababababac', '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', '250000000');
        const synthTx = defi_utils.default.defiWithdrawDepositedTokenTx('0xabababababababababababababababababababac', '0xacacacacacacacacacacacacacacacacacacacad', '300000000');

        it('should be correct DeFi contract address', () => {
            expect(nativeTx.to).to.equal('0xabababababababababababababababababababac');
            expect(synthTx.to).to.equal('0xabababababababababababababababababababac');
        });

        it('should be correct Opera chain', () => {
            expect(nativeTx.chainId).to.equal('0xfa');
            expect(synthTx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(nativeTx.value).to.equal('0x0');
            expect(synthTx.value).to.equal('0x0');
        });

        it('should have correct serialized call input', () => {
            expect(nativeTx.data).to.equal('0xf3fef3a3000000000000000000000000ffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000ee6b280');
            expect(synthTx.data).to.equal('0xf3fef3a3000000000000000000000000acacacacacacacacacacacacacacacacacacacad0000000000000000000000000000000000000000000000000000000011e1a300');
        });
    });

    // buy DeFi
    describe('DeFi buy tokens tx builder', () => {
        // create a native and non-native token tx
        const nativeTx = defi_utils.default.defiBuyTokenTx('0xabababababababababababababababababababa3', '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', '250000000');
        const synthTx = defi_utils.default.defiBuyTokenTx('0xabababababababababababababababababababa3', '0xacacacacacacacacacacacacacacacacacacaca7', '300000000');

        it('should be correct DeFi contract address', () => {
            expect(nativeTx.to).to.equal('0xabababababababababababababababababababa3');
            expect(synthTx.to).to.equal('0xabababababababababababababababababababa3');
        });

        it('should be correct Opera chain', () => {
            expect(nativeTx.chainId).to.equal('0xfa');
            expect(synthTx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(nativeTx.value).to.equal('0x0');
            expect(synthTx.value).to.equal('0x0');
        });

        it('should have correct serialized call input', () => {
            expect(nativeTx.data).to.equal('0xcce7ec13000000000000000000000000ffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000ee6b280');
            expect(synthTx.data).to.equal('0xcce7ec13000000000000000000000000acacacacacacacacacacacacacacacacacacaca70000000000000000000000000000000000000000000000000000000011e1a300');
        });
    });

    // sell DeFi
    describe('DeFi sell tokens tx builder', () => {
        // create a native and non-native token tx
        const nativeTx = defi_utils.default.defiSellTokenTx('0xabababababababababababababababababababad', '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', '250000000');
        const synthTx = defi_utils.default.defiSellTokenTx('0xabababababababababababababababababababad', '0xacacacacacacacacacacacacacacacacacacaca1', '300000000');

        it('should be correct DeFi contract address', () => {
            expect(nativeTx.to).to.equal('0xabababababababababababababababababababad');
            expect(synthTx.to).to.equal('0xabababababababababababababababababababad');
        });

        it('should be correct Opera chain', () => {
            expect(nativeTx.chainId).to.equal('0xfa');
            expect(synthTx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(nativeTx.value).to.equal('0x0');
            expect(synthTx.value).to.equal('0x0');
        });

        it('should have correct serialized call input', () => {
            expect(nativeTx.data).to.equal('0x6c197ff5000000000000000000000000ffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000ee6b280');
            expect(synthTx.data).to.equal('0x6c197ff5000000000000000000000000acacacacacacacacacacacacacacacacacacaca10000000000000000000000000000000000000000000000000000000011e1a300');
        });
    });

    // borrow DeFi
    describe('DeFi borrow tokens tx builder', () => {
        // create a native and non-native token tx
        const nativeTx = defi_utils.default.defiBorrowTokenTx('0xabababababababababababababababababababad', '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', '250000000');
        const synthTx = defi_utils.default.defiBorrowTokenTx('0xabababababababababababababababababababad', '0xacacacacacacacacacacacacacacacacacacaca1', '300000000');

        it('should be correct DeFi contract address', () => {
            expect(nativeTx.to).to.equal('0xabababababababababababababababababababad');
            expect(synthTx.to).to.equal('0xabababababababababababababababababababad');
        });

        it('should be correct Opera chain', () => {
            expect(nativeTx.chainId).to.equal('0xfa');
            expect(synthTx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(nativeTx.value).to.equal('0x0');
            expect(synthTx.value).to.equal('0x0');
        });

        it('should have correct serialized call input', () => {
            expect(nativeTx.data).to.equal('0x4b8a3529000000000000000000000000ffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000ee6b280');
            expect(synthTx.data).to.equal('0x4b8a3529000000000000000000000000acacacacacacacacacacacacacacacacacacaca10000000000000000000000000000000000000000000000000000000011e1a300');
        });
    });

    // repay DeFi
    describe('DeFi repay tokens tx builder', () => {
        // create a native and non-native token tx
        const nativeTx = defi_utils.default.defiRepayTokenTx('0xabababababababababababababababababababaf', '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', '250000000');
        const synthTx = defi_utils.default.defiRepayTokenTx('0xabababababababababababababababababababaf', '0xacacacacacacacacacacacacacacacacacacaca5', '300000000');

        it('should be correct DeFi contract address', () => {
            expect(nativeTx.to).to.equal('0xabababababababababababababababababababaf');
            expect(synthTx.to).to.equal('0xabababababababababababababababababababaf');
        });

        it('should be correct Opera chain', () => {
            expect(nativeTx.chainId).to.equal('0xfa');
            expect(synthTx.chainId).to.equal('0xfa');
        });

        it('should be correct contract amount', () => {
            expect(nativeTx.value).to.equal('0x0');
            expect(synthTx.value).to.equal('0x0');
        });

        it('should have correct serialized call input', () => {
            expect(nativeTx.data).to.equal('0x22867d78000000000000000000000000ffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000ee6b280');
            expect(synthTx.data).to.equal('0x22867d78000000000000000000000000acacacacacacacacacacacacacacacacacacaca50000000000000000000000000000000000000000000000000000000011e1a300');
        });
    });
});

