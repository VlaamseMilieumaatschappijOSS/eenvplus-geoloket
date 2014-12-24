///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureLayerStore {
        layers:ol.layer.Vector[];
        getInfo(json:feature.model.FeatureJSON):FeatureInfo;
    }

    export interface FeatureInfo {
        olFeature:feature.LocalFeature;
        layer:ol.layer.Vector;
    }

    export module FeatureLayerStore {
        export var NAME:string = PREFIX + 'FeatureLayerStore';

        var store = {
            layers: [],
            getInfo: getInfo
        };

        function getInfo(json:feature.model.FeatureJSON):FeatureInfo {
            var layer:ol.layer.Vector = _.where(store.layers, {values_: {layerBodId: json.layerBodId}})[0];
            return {
                layer: layer,
                olFeature: _.find(layer.getSource().getFeatures(), {key: json.key})
            };
        }

        angular
            .module(MODULE)
            .factory(NAME, factory(store));
    }

}
