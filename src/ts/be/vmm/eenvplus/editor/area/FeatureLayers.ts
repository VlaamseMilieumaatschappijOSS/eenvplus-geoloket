///ts:ref=Mask
/// <reference path="./Mask.ts"/> ///ts:ref:generated
///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area.featureLayers {
    'use strict';

    FeatureLayersController.$inject = [
        'epMap', 'epStateStore', 'epAreaStore', 'epFeatureManager', 'epFeatureLayerFactory'
    ];

    export function FeatureLayersController(map:ol.Map,
                                            stateStore:state.StateStore,
                                            store:AreaStore,
                                            manager:feature.FeatureManager,
                                            featureLayer:feature.FeatureLayerFactory):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var addLayer = map.addLayer.bind(map),
            removeLayer = map.removeLayer.bind(map),
            featureLayers:ol.layer.Layer[];


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        store.selected.add(init);
        manager.signal.load.add(createLayers);
        manager.signal.remove.add(removeFromLayer);

        function init(extent:ol.Extent):void {
            manager.load(extent);
            stateStore.modeChanged.add(handleModeChange);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function createLayers():void {
            featureLayers = _(map.getLayers().getArray())
                .invoke(ol.layer.Base.prototype.get, 'bodId')
                .filter(feature.isEditable)
                .map(feature.toType)
                .map(featureLayer.createLayer)
                .value();
            featureLayers.forEach(addLayer);
        }

        function removeFromLayer(json:feature.model.FeatureJSON):void {
            var layer:ol.layer.Vector = _.where(featureLayers, {values_: {layerBodId: json.layerBodId}})[0],
                feature = _.find(layer.getSource().getFeatures(), {key: json.key});
            layer.getSource().removeFeature(feature);
        }

        function clear():void {
            stateStore.modeChanged.remove(handleModeChange);
            featureLayers.forEach(removeLayer);
            featureLayers = [];
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleModeChange(editMode:state.State):void {
            if (editMode === state.State.VIEW) clear();
        }

    }

    angular
        .module(MODULE)
        .run(FeatureLayersController);

}
