///ts:ref=Mask
/// <reference path="./Mask.ts"/> ///ts:ref:generated
///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area.featureLayers {
    'use strict';

    FeatureLayersController.$inject = [
        'epMap', 'epStateStore', 'epAreaStore', 'epFeatureManager', 'epFeatureLayerStore', 'epFeatureLayerFactory'
    ];

    export function FeatureLayersController(map:ol.Map,
                                            stateStore:state.StateStore,
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

        store.selected.add(init);
        manager.signal.load.add(createLayers);
        manager.signal.update.add(updateFeature);
        manager.signal.remove.add(removeFromLayer);

        function init(extent:ol.Extent):void {
            manager.load(extent);
            stateStore.modeChanged.add(handleModeChange);
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleModeChange(editMode:state.State):void {
            if (editMode === state.State.VIEW) clear();
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
            stateStore.modeChanged.remove(handleModeChange);
            featureLayerStore.layers.forEach(removeLayer);
            featureLayerStore.layers = [];
        }

    }

    angular
        .module(MODULE)
        .run(FeatureLayersController);

}
