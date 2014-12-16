///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area {
    'use strict';

    Selector.$inject = ['epMap', 'epStateStore', 'epFeatureStore', 'epPainterStore', 'epFeatureManager'];

    function Selector(map:ol.Map,
                      stateStore:state.StateStore,
                      featureStore:feature.FeatureStore,
                      painterStore:paint.PainterStore,
                      featureManager:feature.FeatureManager):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var select = createInteraction(ol.events.condition.click),
            highlight = createInteraction(ol.events.condition.mouseMove),
            all = [select, highlight];

        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        select.getFeatures().on(ol.CollectionEventType.ADD, _.compose(selectFeature, get('element')));

        stateStore.modeChanged.add(invalidateState);
        featureStore.selected.add(invalidateState);
        painterStore.selected.add(invalidateState);

        function createInteraction(condition):ol.interaction.Select {
            var interaction = new ol.interaction.Select({
                condition: condition
            });

            interaction.setActive(false);
            map.addInteraction(interaction);

            interaction.handleMapBrowserEvent = _.wrap(interaction.handleMapBrowserEvent, alwaysBubble);

            return interaction;
        }

        function alwaysBubble(fn:Function, event:ol.MapBrowserEvent):boolean {
            fn.bind(this)(event);
            return true;
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function selectFeature(selectedFeature:feature.LocalFeature):void {
            featureManager
                .get(feature.toLayerBodId(selectedFeature.type), selectedFeature.key)
                .then(featureManager.select);
        }

        function invalidateState():void {
            // the value of an enum can be 0, hence the explicit undefined check
            var active =
                stateStore.currentMode === state.State.EDIT &&
                featureStore.current === undefined &&
                painterStore.current === undefined;

            _.invoke(all, 'setActive', active);
        }

    }

    angular
        .module(MODULE)
        .run(Selector);

}
