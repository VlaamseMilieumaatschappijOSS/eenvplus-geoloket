///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureSync {
        toModel(json:model.FeatureJSON, olFeature?:ol.Feature):void;
        toView(json:model.FeatureJSON, olFeature?:ol.Feature):void;
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

            function toModel(json:model.FeatureJSON, olFeature?:ol.Feature):void {
                olFeature = olFeature || getFeature(json);
                json.geometry = geoJson.writeGeometry(olFeature.getGeometry());
            }

            function toView(json:model.FeatureJSON, olFeature?:ol.Feature):void {
                olFeature = olFeature || getFeature(json);
                olFeature.setGeometry(geoJson.readGeometry(json.geometry));
            }

            function getFeature(json:model.FeatureJSON):ol.Feature {
                return layerStore.getInfo(json).olFeature;
            }
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
