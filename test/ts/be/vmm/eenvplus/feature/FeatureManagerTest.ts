///ts:ref=mocha
/// <reference path="../../../../../../src/lib/ts/mocha.d.ts"/> ///ts:ref:generated
///ts:ref=chai
/// <reference path="../../../../../../src/lib/ts/chai.d.ts"/> ///ts:ref:generated
///ts:ref=angular-mocks
/// <reference path="../../../../../../src/lib/ts/angular-mocks.d.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    beforeEach(module('ep_eenvplus'));

    describe('FeatureManager', () => {

        beforeEach(module('ep_feature'));

        it('should fail', () => {
            expect(true).to.be.false();
        });

    });

}
