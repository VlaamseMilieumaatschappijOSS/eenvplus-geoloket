///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.state {
    'use strict';

    StateManager.$inject = ['epStateStore', 'epMap', 'epFeatureStore', 'epFeatureManager'];

    function StateManager(store:StateStore,
                          map:ol.Map,
                          featureStore:feature.FeatureStore,
                          featureManager:feature.FeatureManager):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var view = map.getView(),
            layers = map.getLayers(),
            threshold;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        view.on(changeEvent(ol.ViewProperty.RESOLUTION), invalidateLevel);
        layers.on(changeEvent(ol.CollectionProperty.LENGTH), setLevelThreshold);
        featureStore.selected.add(invalidateFeatureSelection);
        featureManager.signal.validate.add(invalidateValidity);


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function setLevelThreshold():void {
            var resolutions = _(layers.getArray())
                .filter('displayInLayerManager')
                .invoke(ol.layer.Base.prototype.get, ol.layer.LayerProperty.MAX_RESOLUTION)
                .value();
            threshold = Math.max.apply(null, resolutions);
        }

        function invalidateLevel():void {
            store.currentLevel = view.getResolution() < threshold ? State.DETAIL : State.OVERVIEW;
        }

        function invalidateFeatureSelection(feature:feature.model.FeatureJSON):void {
            store.featureSelected = feature ? State.FEATURE_SELECTED : -1;
        }

        function invalidateValidity(result:editor.validation.ValidationResult):void {
            store.invalid = result.valid ? -1 : State.INVALID;
        }

    }

    angular
        .module(MODULE)
        .run(StateManager);

}
