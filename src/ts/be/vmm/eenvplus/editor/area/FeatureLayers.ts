///ts:ref=Mask
/// <reference path="./Mask.ts"/> ///ts:ref:generated
///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area.featureLayers {
    'use strict';

    FeatureLayersController.$inject = [
        'epMap', 'epAreaStore', 'epFeatureManager', 'epFeatureLayerStore', 'epFeatureLayerFactory'
    ];

    export function FeatureLayersController(map:ol.Map,
                                            store:AreaStore,
                                            manager:feature.FeatureManager,
                                            featureLayerStore:feature.FeatureLayerStore,
                                            featureLayerFactory:feature.FeatureLayerFactory):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var addLayer = map.addLayer.bind(map),
            removeLayer = map.removeLayer.bind(map);


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        store.selected.add(handleAreaSelection);
        manager.loaded.add(createLayers);
        manager.updated.add(updateFeature);
        manager.removed.add(removeFromLayer);


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleAreaSelection(extent:ol.Extent):void {
            extent ? manager.load(extent) : clear();
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function createLayers():void {
            featureLayerStore.layers = _(map.getLayers().getArray())
                .invoke(ol.layer.Base.prototype.get, 'bodId')
                .filter(feature.isEditable)
                .map(feature.toType)
                .map(featureLayerFactory.createLayer)
                .value();
            featureLayerStore.layers.forEach(addLayer);
        }

        function updateFeature(json:feature.model.FeatureJSON):void {
            var info = featureLayerStore.getInfo(json);
            info.olFeature.action = json.action;
            info.layer.changed();
        }

        function removeFromLayer(json:feature.model.FeatureJSON):void {
            var info = featureLayerStore.getInfo(json);
            info.layer.getSource().removeFeature(info.olFeature);
        }

        function clear():void {
            manager.clear();
            featureLayerStore.layers.forEach(removeLayer);
            featureLayerStore.layers = [];
        }

    }

    angular
        .module(MODULE)
        .run(FeatureLayersController);

}
