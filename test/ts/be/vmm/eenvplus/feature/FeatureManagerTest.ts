///ts:ref=mocha
/// <reference path="../../../../../../src/lib/ts/mocha.d.ts"/> ///ts:ref:generated
///ts:ref=chai
/// <reference path="../../../../../../src/lib/ts/chai.d.ts"/> ///ts:ref:generated
///ts:ref=angular-mocks
/// <reference path="../../../../../../src/lib/ts/angular-mocks.d.ts"/> ///ts:ref:generated
///ts:ref=MockData
/// <reference path="./MockData.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    beforeEach(module('ep_feature'));

    describe('FeatureManager', () => {

        var manager,
            ng;

        beforeEach(inject(function(_epFeatureManager_, _$rootScope_) {
            ng = _$rootScope_;
            manager = _epFeatureManager_;

            sewers.forEach(_.partial(commitIndexedDBMockData, sewer.replace('all:', '')));
            appurtenances.forEach(_.partial(commitIndexedDBMockData, appurtenance.replace('all:', '')));
            nodes.forEach(_.partial(commitIndexedDBMockData, node.replace('all:', '')));

            FeatureService.indexedDB = mockIndexedDB;
        }));

        it('should fail', () => {
            expect(true).to.be.true();
        });

        afterEach(resetIndexedDBMock);

    });

}
