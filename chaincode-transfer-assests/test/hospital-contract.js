/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { AdminContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('HospitalContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new AdminContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"hospital 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"hospital 1002 value"}'));
    });

    describe('#getLastPatientId', () => {

        it('should return a hospital', async () => {
            await contract.getLastPatientId(ctx).should.eventually.equal({ value: 'hospital 1001 value' });
        });

        it('should throw an error for a hospital that does not exist', async () => {
            await contract.getLastPatientId(ctx).should.be.rejectedWith(/The hospital 1003 does not exist/);
        });

    });

    describe('#hospitalExists', () => {

        it('should return true for a hospital', async () => {
            await contract.hospitalExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a hospital that does not exist', async () => {
            await contract.hospitalExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createHospital', () => {

        it('should create a hospital', async () => {
            await contract.createHospital(ctx, '1003', 'hospital 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"hospital 1003 value"}'));
        });

        it('should throw an error for a hospital that already exists', async () => {
            await contract.createHospital(ctx, '1001', 'myvalue').should.be.rejectedWith(/The hospital 1001 already exists/);
        });

    });

    describe('#readHospital', () => {

        it('should return a hospital', async () => {
            await contract.readHospital(ctx, '1001').should.eventually.deep.equal({ value: 'hospital 1001 value' });
        });

        it('should throw an error for a hospital that does not exist', async () => {
            await contract.readHospital(ctx, '1003').should.be.rejectedWith(/The hospital 1003 does not exist/);
        });

    });

    describe('#updateHospital', () => {

        it('should update a hospital', async () => {
            await contract.updateHospital(ctx, '1001', 'hospital 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"hospital 1001 new value"}'));
        });

        it('should throw an error for a hospital that does not exist', async () => {
            await contract.updateHospital(ctx, '1003', 'hospital 1003 new value').should.be.rejectedWith(/The hospital 1003 does not exist/);
        });

    });

    describe('#deleteHospital', () => {

        it('should delete a hospital', async () => {
            await contract.deleteHospital(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a hospital that does not exist', async () => {
            await contract.deleteHospital(ctx, '1003').should.be.rejectedWith(/The hospital 1003 does not exist/);
        });

    });



});
