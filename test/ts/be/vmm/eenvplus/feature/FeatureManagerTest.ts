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
            service,
            ng;

        beforeEach(inject(function(_epFeatureManager_, _epFeatureService_, _$rootScope_) {
            ng = _$rootScope_;
            manager = _epFeatureManager_;
            service = _epFeatureService_;

            sewers.forEach(_.partial(commitIndexedDBMockData, sewer.replace('all:', '')));
            appurtenances.forEach(_.partial(commitIndexedDBMockData, appurtenance.replace('all:', '')));
            nodes.forEach(_.partial(commitIndexedDBMockData, node.replace('all:', '')));

            FeatureService.indexedDB = mockIndexedDB;
        }));

        // indexeddb mock doesn't support parallel access
        xit('removes a feature and connected nodes', (done) => {
            var i = 0;
            manager.signal.remove.add((result:model.FeatureJSON):void => {
                expect(result.action).to.equal('delete');

                if (i === 3) {
                    expect(mockIndexedDBItems[sewer].length).to.equal(sewers.length);
                    expect(mockIndexedDBItems[node].length).to.equal(nodes.length);
                    expect(getDeleted(mockIndexedDBItems[sewer]).length).to.equal(sewers.length - 1);
                    expect(getDeleted(mockIndexedDBItems[node]).length).to.equal(nodes.length - 2);

                    done();
                }
            });
            manager.remove(_.cloneDeep(sewers[2]));

            ng.$digest();
        });

        afterEach(resetIndexedDBMock);

    });

    function getDeleted(list) {
        return _(list).map('value').reject({action: 'delete'}).value();
    }

}
