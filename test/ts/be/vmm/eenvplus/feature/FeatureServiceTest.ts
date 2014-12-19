module be.vmm.eenvplus.feature {
    'use strict';

    beforeEach(module('ep_feature'));

    describe('FeatureService', () => {

        var service:FeatureService,
            sewer:string = toLayerBodId(FeatureType.SEWER);

        var savedItem1 = {'foo': 'bar2'};
        var savedItem2 = {'baz': 'bat'};

        var rs;

        beforeEach(inject((_epFeatureService_, _$rootScope_) => {rs = _$rootScope_;
            service = _epFeatureService_;
            resetIndexedDBMock();
            commitIndexedDBMockData(sewer, savedItem1);
            commitIndexedDBMockData(toLayerBodId(FeatureType.APPURTENANCE), savedItem2);
            commitIndexedDBMockData(toLayerBodId(FeatureType.NODE), savedItem2);
        }));

        it('should fail', (done) => {
            var openCursor = sinon.spy(mockIndexedDBStore, 'openCursor');
            //var spy = sinon.spy(service, 'getIndexedDB');
           // service.get(sewer, 123);
            service.query(sewer, [1, 2]).then(() => {
                console.log('YEY');
               done();
            });
            rs.$digest();
            //expect(openCursor.called).to.be.true();
        });

    });

}
