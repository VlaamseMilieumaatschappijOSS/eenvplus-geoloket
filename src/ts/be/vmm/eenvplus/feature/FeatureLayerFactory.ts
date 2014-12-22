///ts:ref=FeatureService
/// <reference path="./FeatureService.ts"/> ///ts:ref:generated
///ts:ref=SRSNameService
/// <reference path="../config/SRSNameService.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export module FeatureLayerFactory {
        export var NAME:string = PREFIX + 'FeatureLayerFactory';
    }

    export interface FeatureLayerFactory {
        createSource(type:FeatureType):ol.source.ServerVector;
        createLayer(type:FeatureType):ol.layer.Vector;
    }

    factory.$inject = ['epFeatureService', 'epSRSName'];

    function factory(service:FeatureService, srsName:config.SRSNameService):FeatureLayerFactory {
        return {
            createSource: createSource,
            createLayer: createLayer
        };

        function createSource(type:FeatureType):ol.source.ServerVector {
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
                    .query(feature.toLayerBodId(type), extent)
                    .then(addFeatures);
            }

            function addFeatures(results:ol.format.GeoJSONFeature[]):void {
                source.addFeatures(source.readFeatures({
                    type: 'FeatureCollection',
                    features: results
                }));
            }
        }

        function createLayer(type:FeatureType):ol.layer.Vector {
            var defaultStyle = createStyle(type, FeatureMode.DEFAULT),
                modifiedStyle = createStyle(type, FeatureMode.MODIFIED),
                layer = new ol.layer.Vector({
                    source: createSource(type),
                    style: getStyle
                });

            layer.set(model.LayerProperty.TYPE_ID, toLayerBodId(type));
            layer.set(model.LayerProperty.FEATURE_TYPE, type);
            return layer;

            function getStyle(feature:LocalFeature):ol.style.Style[] {
                return feature.action ? modifiedStyle(feature) : defaultStyle(feature);
            }
        }
    }

    ol.format.GeoJSON.prototype.readFeatureFromObject =
        _.wrap(ol.format.GeoJSON.prototype.readFeatureFromObject, addKey);

    function addKey(fn:Function, json:model.FeatureJSON, options?:any):LocalFeature {
        var feature = fn(json, options);
        if (json.key) feature.key = json.key;
        feature.type = toType(json.layerBodId);
        return feature;
    }

    angular
        .module(MODULE)
        .factory(FeatureLayerFactory.NAME, factory);

}
