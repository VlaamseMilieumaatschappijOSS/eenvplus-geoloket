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
                                            state:StateStore,
                                            store:AreaStore,
                                            manager:feature.FeatureManager,
                                            featureLayer:feature.FeatureLayerFactory):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var addLayer = map.addLayer.bind(map),
            removeLayer = map.removeLayer.bind(map),
            featureLayers:ol.layer.Layer[];

        var select = new ol.interaction.Select({
            condition: ol.events.condition.click
        });
        var highlight = new ol.interaction.Select({
            condition: ol.events.condition.mouseMove
        });


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        store.selected.add(init);
        manager.signal.load.add(createLayers);
        manager.signal.remove.add(removeFromLayer);
        select.getFeatures().on(ol.CollectionEventType.ADD, (event:ol.CollectionEvent<ol.Feature>):void => {
            console.log(event.element);
        });

        function init(extent:ol.Extent):void {
            manager.load(extent);
            state.modeChanged.add(handleModeChange);
        }

        select.handleMapBrowserEvent = _.wrap(select.handleMapBrowserEvent, alwaysBubble);
        highlight.handleMapBrowserEvent = _.wrap(highlight.handleMapBrowserEvent, alwaysBubble);

        function alwaysBubble(fn:Function, event:ol.MapBrowserEvent):boolean {
            fn.bind(this)(event);
            return true;
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

            map.addInteraction(select);
            map.addInteraction(highlight);
        }

        function removeFromLayer(json:feature.model.FeatureJSON):void {
            var layer:ol.layer.Vector = _.where(featureLayers, {values_: {layerBodId: json.layerBodId}})[0],
                feature = _.find(layer.getSource().getFeatures(), {key: json.key});
            layer.getSource().removeFeature(feature);
        }

        function clear():void {
            map.removeInteraction(select);
            map.removeInteraction(highlight);
            state.modeChanged.remove(handleModeChange);
            featureLayers.forEach(removeLayer);
            featureLayers = [];
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleModeChange(editMode:applicationState.State):void {
            if (editMode === applicationState.State.VIEW) clear();
        }

    }

    angular
        .module(MODULE)
        .run(FeatureLayersController);

}
