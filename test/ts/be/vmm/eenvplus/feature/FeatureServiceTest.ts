///ts:ref=MockData
/// <reference path="./MockData.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    beforeEach(module('ep_feature'));
    beforeEach(module(($provide:ng.auto.IProvideService):void => {
        $provide.constant('gaGlobalOptions', {});
    }));

    describe('FeatureService', () => {

        var service:FeatureService,
            ng;

        beforeEach(inject((_epFeatureService_, _$rootScope_) => {
            ng = _$rootScope_;
            service = _epFeatureService_;

            sewers.forEach(_.partial(commitIndexedDBMockData, sewer));
            appurtenances.forEach(_.partial(commitIndexedDBMockData, appurtenance));
            nodes.forEach(_.partial(commitIndexedDBMockData, node));

            FeatureService.indexedDB = mockIndexedDB;
        }));

        it('fetches all features', (done) => {
            var openCursor = sinon.spy(mockIndexedDBStore, 'openCursor');

            service
                .query(sewer, () => {
                    return true;
                })
                .then((results) => {
                    expect(openCursor.called).to.be.true();
                    expect(results.length).to.equal(sewers.length);
                    done();
                });

            ng.$digest();
        });

        it('removes all features', (done) => {
            service
                .clear()
                .then(() => {
                    service
                        .query(sewer, () => {
                            return true;
                        })
                        .then((results) => {
                            expect(results.length).to.equal(0);
                            done();
                        });
                });

            ng.$digest();
        });

        it('gets a feature', (done) => {
            service
                .get(sewer, 1)
                .then((result) => {
                    expect(result.key).to.equal(1);
                    done();
                });

            ng.$digest();
        });

        it('removes a specific feature with ID', (done) => {
            service
                .remove(_.cloneDeep(sewers[2]))
                .then((result) => {
                    expect(result.key).to.equal(2);
                    expect(result.action).to.equal('delete');
                    expect(mockIndexedDBItems[sewer].length).to.equal(sewers.length);

                    service
                        .query(sewer, () => {
                            return true;
                        })
                        .then((results) => {
                            expect(results.length).to.equal(sewers.length - 1);
                            done();
                        });
                });

            ng.$digest();
        });

        it('removes a specific feature without ID', (done) => {
            service
                .remove(_.cloneDeep(sewers[7]))
                .then((result) => {
                    expect(result.key).to.equal(7);
                    expect(result.action).not.to.equal('delete');
                    expect(mockIndexedDBItems[sewer].length).to.equal(sewers.length - 1);

                    service
                        .query(sewer, () => {
                            return true;
                        })
                        .then((results) => {
                            expect(results.length).to.equal(sewers.length - 1);
                            done();
                        });
                });

            ng.$digest();
        });

        afterEach(resetIndexedDBMock);

    });

}
