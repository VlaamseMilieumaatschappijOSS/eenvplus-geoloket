///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area {
    'use strict';

    Selector.$inject = [
        'epMap', 'epStateStore', 'epFeatureStore', 'epFeatureLayerStore', 'epPainterStore',
        'epFeatureManager', 'epFeatureStyleFactory'
    ];

    function Selector(map:ol.Map,
                      stateStore:state.StateStore,
                      featureStore:feature.FeatureStore,
                      featureLayerStore:feature.FeatureLayerStore,
                      painterStore:paint.PainterStore,
                      featureManager:feature.FeatureManager,
                      createStyle:feature.StyleFactory):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var selectInteraction = createInteraction(ol.events.condition.click),
            highlightInteraction = createInteraction(ol.events.condition.mouseMove),
            selection = featureStore.selection = selectInteraction.getFeatures(),
            highlighted = highlightInteraction.getFeatures(),
            stylesByType:feature.getStyle[] = [],
            all = [selectInteraction, highlightInteraction];


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        selection.on(ol.CollectionEventType.ADD, _.compose(selectFeature, get('element')));

        stateStore.modeChanged.add(invalidateState);
        featureStore.selected.add(invalidateState);
        featureStore.emphasize.add(highlight);
        painterStore.selected.add(invalidateState);

        function createInteraction(condition):ol.interaction.Select {
            var interaction = new ol.interaction.Select({
                condition: condition,
                style: getStyle
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

        function getStyle(olFeature:feature.LocalFeature):ol.style.Style[] {
            var type = olFeature.type,
                style = stylesByType[type];

            if (!style) {
                style = createStyle(type, feature.FeatureMode.SELECTED);
                stylesByType[type] = style;
            }
            return style(olFeature);
        }

        function selectFeature(selectedFeature:feature.LocalFeature):void {
            if (featureStore.current && featureStore.current.key === selectedFeature.key) return;

            featureManager
                .get(feature.toLayerBodId(selectedFeature.type), selectedFeature.key)
                .then(featureManager.select);
        }

        function highlight(json:feature.model.FeatureJSON):void {
            json ? highlighted.push(featureLayerStore.getInfo(json).olFeature) : <any> highlighted.clear();
        }

        function invalidateState():void {
            // the value of an enum can be 0, hence the explicit undefined check
            var active =
                stateStore.currentMode === state.State.EDIT &&
                painterStore.current === undefined && !featureStore.current;

            _.invoke(all, 'setActive', active);

            if (!featureStore.current)
                selection.clear();
            else if (!selection.getLength())
                selection.push(featureLayerStore.getInfo(featureStore.current).olFeature);
        }

    }

    angular
        .module(MODULE)
        .run(Selector);

}
