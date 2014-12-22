module be.vmm.eenvplus.feature {
    'use strict';

    var sewer = toLayerBodId(FeatureType.SEWER),
        appurtenance = toLayerBodId(FeatureType.APPURTENANCE),
        node = toLayerBodId(FeatureType.NODE);

    var sewers = [
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.RioolLink","id":882615,"featureId":882615,"properties":{"alternatieveId":"6549909","beginLifespanVersion":1390441635000,"creationDate":1390441635000,"diameter":3,"endKoppelPuntId":474492,"endLifespanVersion":null,"label":null,"namespaceId":2,"omschrijving":"Gemeente","pressure":1,"rioolLinkTypeId":1,"sewerWaterTypeId":2,"startKoppelPuntId":317372,"statussen":[{"id":4517,"statusId":0,"geldigVanaf":2366838000000,"geldigTot":null}],"straatId":33813,"userId":null},"type":"Feature","geometry":{"type":"LineString","coordinates":[[167163.31047956116,168799.7121720696],[167122.19045333882,168838.64207498543],[167106.48706800438,168793.19701653533],[167103.75039236786,168753.9520422658],[167112.88550456348,168717.6148382835],[167119.24955444972,168676.20811670925],[167125.02302028012,168662.23021528684],[167163.9181171866,168609.96499435417],[167173.00136980964,168595.36687483918]],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[167103.75039236786,168595.36687483918,167173.00136980964,168838.64207498543]},"key":0},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.RioolLink","id":882616,"featureId":882616,"properties":{"alternatieveId":"6549910","beginLifespanVersion":1390441635000,"creationDate":1390441635000,"diameter":3,"endKoppelPuntId":317371,"endLifespanVersion":null,"label":null,"namespaceId":2,"omschrijving":"Gemeente","pressure":1,"rioolLinkTypeId":1,"sewerWaterTypeId":2,"startKoppelPuntId":474493,"statussen":[{"id":4518,"statusId":0,"geldigVanaf":2366838000000,"geldigTot":null}],"straatId":33813,"userId":null},"type":"Feature","geometry":{"type":"LineString","coordinates":[[167129.08106663197,168233.98814355396],[167182.1160737017,168162.18863869272]],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[167129.08106663197,168162.18863869272,167182.1160737017,168233.98814355396]},"key":1},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.RioolLink","id":724393,"featureId":724393,"properties":{"alternatieveId":"20174695","beginLifespanVersion":1390441635000,"creationDate":1390441635000,"diameter":3,"endKoppelPuntId":317371,"endLifespanVersion":null,"label":null,"namespaceId":2,"omschrijving":"Gemeente","pressure":1,"rioolLinkTypeId":1,"sewerWaterTypeId":2,"startKoppelPuntId":474492,"statussen":[{"id":9192,"statusId":0,"geldigVanaf":2366838000000,"geldigTot":null}],"straatId":33813,"userId":null},"type":"Feature","geometry":{"type":"LineString","coordinates":[[167173.00136980964,168595.36687483918],[167189.44295027226,168568.94295616727],[167209.19431752973,168522.75508975517],[167224.3876339524,168451.34627895523],[167227.12249242674,168317.03684185818],[167182.1160737017,168162.18863869272]],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[167173.00136980964,168162.18863869272,167227.12249242674,168595.36687483918]},"key":2},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.RioolLink","id":724970,"featureId":724970,"properties":{"alternatieveId":"20175272","beginLifespanVersion":1390441635000,"creationDate":1390441635000,"diameter":3,"endKoppelPuntId":317699,"endLifespanVersion":null,"label":null,"namespaceId":2,"omschrijving":"Gemeente","pressure":1,"rioolLinkTypeId":1,"sewerWaterTypeId":2,"startKoppelPuntId":317299,"statussen":[{"id":9684,"statusId":0,"geldigVanaf":2366838000000,"geldigTot":null}],"straatId":33813,"userId":null},"type":"Feature","geometry":{"type":"LineString","coordinates":[[166593.73053129198,168530.13690110482],[166640.78463424594,168517.40251110215],[166717.969986109,168500.43828123622],[166775.3873365168,168494.99344573636],[166800.63120535016,168496.9733350929],[166888.73712031328,168514.29764651787],[166922.39565868585,168513.80267418548]],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[166593.73053129198,168494.99344573636,166922.39565868585,168530.13690110482]},"key":3},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.RioolLink","id":724972,"featureId":724972,"properties":{"alternatieveId":"20175274","beginLifespanVersion":1390441635000,"creationDate":1390441635000,"diameter":3,"endKoppelPuntId":474493,"endLifespanVersion":null,"label":null,"namespaceId":2,"omschrijving":"Gemeente","pressure":1,"rioolLinkTypeId":1,"sewerWaterTypeId":2,"startKoppelPuntId":317699,"statussen":[{"id":9686,"statusId":0,"geldigVanaf":2366838000000,"geldigTot":null}],"straatId":33813,"userId":null},"type":"Feature","geometry":{"type":"LineString","coordinates":[[166922.39565868585,168513.80267418548],[167129.08106663197,168233.98814355396]],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[166922.39565868585,168233.98814355396,167129.08106663197,168513.80267418548]},"key":4},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.RioolLink","id":724973,"featureId":724973,"properties":{"alternatieveId":"20175275","beginLifespanVersion":1390441635000,"creationDate":1390441635000,"diameter":3,"endKoppelPuntId":474494,"endLifespanVersion":null,"label":null,"namespaceId":2,"omschrijving":"Gemeente","pressure":1,"rioolLinkTypeId":1,"sewerWaterTypeId":2,"startKoppelPuntId":317371,"statussen":[{"id":9687,"statusId":0,"geldigVanaf":2366838000000,"geldigTot":null}],"straatId":33813,"userId":null},"type":"Feature","geometry":{"type":"LineString","coordinates":[[167182.1160737017,168162.18863869272],[167325.66518085304,167969.9351480771],[167355.7849675421,167939.17459516972],[167382.87355537148,167909.69892950822]],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[167182.1160737017,167909.69892950822,167382.87355537148,168162.18863869272]},"key":5},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.RioolLink","id":724974,"featureId":724974,"properties":{"alternatieveId":"20175276","beginLifespanVersion":1390441635000,"creationDate":1390441635000,"diameter":3,"endKoppelPuntId":317699,"endLifespanVersion":null,"label":null,"namespaceId":2,"omschrijving":"Gemeente","pressure":1,"rioolLinkTypeId":1,"sewerWaterTypeId":2,"startKoppelPuntId":317300,"statussen":[{"id":9688,"statusId":0,"geldigVanaf":2366838000000,"geldigTot":null}],"straatId":33813,"userId":null},"type":"Feature","geometry":{"type":"LineString","coordinates":[[166777.97765911807,168684.40472440515],[166922.39565868585,168513.80267418548]],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[166777.97765911807,168513.80267418548,166922.39565868585,168684.40472440515]},"key":6}
    ];
    var appurtenances = [];
    var nodes = [
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.KoppelPunt","id":474492,"featureId":474492,"properties":{"alternatieveId":"7074004_1","beginLifespanVersion":1390440310000,"creationDate":1390440310000,"endLifespanVersion":null,"namespaceId":1,"userId":null},"type":"Feature","geometry":{"type":"Point","coordinates":[167173.00136980964,168595.36687483918],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[167173.00136980964,168595.36687483918,167173.00136980964,168595.36687483918]},"key":7},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.KoppelPunt","id":474493,"featureId":474493,"properties":{"alternatieveId":"7074005_1","beginLifespanVersion":1390440310000,"creationDate":1390440310000,"endLifespanVersion":null,"namespaceId":1,"userId":null},"type":"Feature","geometry":{"type":"Point","coordinates":[167129.08106663197,168233.98814355396],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[167129.08106663197,168233.98814355396,167129.08106663197,168233.98814355396]},"key":8},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.KoppelPunt","id":317299,"featureId":317299,"properties":{"alternatieveId":"116668556371_1","beginLifespanVersion":1390440310000,"creationDate":1390440310000,"endLifespanVersion":null,"namespaceId":1,"userId":null},"type":"Feature","geometry":{"type":"Point","coordinates":[166593.73053129198,168530.13690110482],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[166593.73053129198,168530.13690110482,166593.73053129198,168530.13690110482]},"key":9},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.KoppelPunt","id":317300,"featureId":317300,"properties":{"alternatieveId":"116668773327_1","beginLifespanVersion":1390440310000,"creationDate":1390440310000,"endLifespanVersion":null,"namespaceId":1,"userId":null},"type":"Feature","geometry":{"type":"Point","coordinates":[166777.97765911807,168684.40472440515],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[166777.97765911807,168684.40472440515,166777.97765911807,168684.40472440515]},"key":10},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.KoppelPunt","id":317371,"featureId":317371,"properties":{"alternatieveId":"116678118768_1","beginLifespanVersion":1390440310000,"creationDate":1390440310000,"endLifespanVersion":null,"namespaceId":1,"userId":null},"type":"Feature","geometry":{"type":"Point","coordinates":[167182.1160737017,168162.18863869272],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[167182.1160737017,168162.18863869272,167182.1160737017,168162.18863869272]},"key":11},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.KoppelPunt","id":317372,"featureId":317372,"properties":{"alternatieveId":"116678270566_1","beginLifespanVersion":1390440310000,"creationDate":1390440310000,"endLifespanVersion":null,"namespaceId":1,"userId":null},"type":"Feature","geometry":{"type":"Point","coordinates":[167163.31047956116,168799.7121720696],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[167163.31047956116,168799.7121720696,167163.31047956116,168799.7121720696]},"key":12},
        {"layerBodId":"all:be.vmm.eenvplus.sdi.model.KoppelPunt","id":317699,"featureId":317699,"properties":{"alternatieveId":"116668857274_1","beginLifespanVersion":1390440310000,"creationDate":1390440310000,"endLifespanVersion":null,"namespaceId":1,"userId":null},"type":"Feature","geometry":{"type":"Point","coordinates":[166922.39565868585,168513.80267418548],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:31370"}},"bbox":[166922.39565868585,168513.80267418548,166922.39565868585,168513.80267418548]},"key":13}
    ];

    beforeEach(module('ep_feature'));

    describe('FeatureService', () => {

        var service:FeatureService,
            ng;

        beforeEach(inject((_epFeatureService_, _$rootScope_) => {
            ng = _$rootScope_;
            service = _epFeatureService_;

            sewers.forEach(_.partial(commitIndexedDBMockData, sewer.replace('all:', '')));
            appurtenances.forEach(_.partial(commitIndexedDBMockData, appurtenance.replace('all:', '')));
            nodes.forEach(_.partial(commitIndexedDBMockData, node.replace('all:', '')));

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
                    expect(results.length).to.equal(14);
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

        afterEach(resetIndexedDBMock);

    });

}
