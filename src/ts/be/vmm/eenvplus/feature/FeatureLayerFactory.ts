///ts:ref=FeatureService
/// <reference path="./FeatureService.ts"/> ///ts:ref:generated
///ts:ref=SRSNameService
/// <reference path="../config/SRSNameService.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export var NAME:string = PREFIX + 'FeatureLayerFactory';

    export interface FeatureLayerFactory {
        createSource(layerBodId:string):ol.source.ServerVector;
        createLayer(layerBodId:string):ol.layer.Vector;
    }

    factory.$inject = ['gaFeatureManager', 'gaSRSName'];

    function factory(service:FeatureService, srsName:config.SRSNameService):FeatureLayerFactory {
        return {
            createSource: createSource,
            createLayer: createLayer
        };

        function createSource(layerBodId:string):ol.source.ServerVector {
            var source = new ol.source.ServerVector({
                format: new ol.format.GeoJSON({
                    defaultDataProjection: srsName.default.code
                }),
                loader: load,
                strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
                    maxZoom: 19
                })),
                projection: srsName.default.code
            });

            return source;

            function load(extent:ol.Extent):void {
                service
                    .query(layerBodId, extent)
                    .then(function (results) {
                        source.addFeatures(source.readFeatures({
                            type: 'FeatureCollection',
                            features: results
                        }));
                    });
            }
        }

        function createLayer(layerBodId:string):ol.layer.Vector {
            var layer = new ol.layer.Vector({
                source: createSource(layerBodId),
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#FF0000',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 4,
                        fill: new ol.style.Fill({
                            color: '#880000'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ff0000',
                            width: 2
                        })
                    })
                })
            });
            layer.set('id', layerBodId);
            return layer;
        }
    }

    angular
        .module(MODULE)
        .factory(NAME, factory);

}
