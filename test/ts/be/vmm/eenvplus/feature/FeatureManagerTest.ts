///ts:ref=mocha
/// <reference path="../../../../../../src/lib/ts/mocha.d.ts"/> ///ts:ref:generated
///ts:ref=chai
/// <reference path="../../../../../../src/lib/ts/chai.d.ts"/> ///ts:ref:generated
///ts:ref=angular-mocks
/// <reference path="../../../../../../src/lib/ts/angular-mocks.d.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    beforeEach(module('ep_feature'));

    describe('FeatureManager', () => {

        var manager;

        beforeEach(inject(function(_epFeatureManager_) {
            manager = _epFeatureManager_;
            console.log(manager);
        }));

        it('should fail', () => {
            expect(true).to.be.true();
        });

    });

}
