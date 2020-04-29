const expect = require('chai').expect;
const sfc_utils = require('../lib/sfc-utils');

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

        it('should reject negative validator id', () => {
            expect(sfc_utils.default.createDelegationTx.bind(sfc_utils.default, 1, -1)).to.throw('Validator id must be positive unsigned integer value.');
        });

        it('should reject negative validator id', () => {
            expect(sfc_utils.default.createDelegationTx.bind(sfc_utils.default, 1, 0)).to.throw('Validator id must be positive unsigned integer value.');
        });

        it('should reject invalid validator id', () => {
            expect(sfc_utils.default.createDelegationTx.bind(sfc_utils.default, 1, 1.5)).to.throw('Validator id must be positive unsigned integer value.');
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
            expect(tx.data).to.equal('0xf99837e60000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000087e');
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
            expect(tx.data).to.equal('0xf0f947c800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d9d');
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

});

