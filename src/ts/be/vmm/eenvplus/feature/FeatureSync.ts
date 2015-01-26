///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureSync {
        toModel(json:model.FeatureJSON, olFeature?:ol.Feature):model.FeatureJSON;
        toView(json:model.FeatureJSON, olFeature?:ol.Feature):model.FeatureJSON;
    }

    export module FeatureSync {
        export var NAME:string = PREFIX + 'FeatureSync';

        var geoJson = new ol.format.GeoJSON();

        factory.$inject = ['epFeatureLayerStore'];

        function factory(layerStore:FeatureLayerStore):FeatureSync {
            return {
                toModel: toModel,
                toView: toView
            };

            function toModel(json:model.FeatureJSON, olFeature?:ol.Feature):model.FeatureJSON {
                olFeature = olFeature || getFeature(json);
                json.geometry = geoJson.writeGeometry(olFeature.getGeometry());
                return json;
            }

            function toView(json:model.FeatureJSON, olFeature?:ol.Feature):model.FeatureJSON {
                olFeature = olFeature || getFeature(json);

                if (olFeature) olFeature.setGeometry(geoJson.readGeometry(json.geometry));
                else layerStore.getInfo(json).layer.getSource().addFeature(createFeature(json));

                return json;
            }

            function getFeature(json:model.FeatureJSON):ol.Feature {
                return layerStore.getInfo(json).olFeature;
            }

            function createFeature(json:model.FeatureJSON):ol.Feature {
                return _.merge(new ol.Feature({
                    geometry: new ol.geom.Point(json.geometry.coordinates)
                }), {
                    key: json.key,
                    type: toType(json)
                });
            }
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
