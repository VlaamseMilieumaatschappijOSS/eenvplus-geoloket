///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.state {
    'use strict';

    StateManager.$inject = [
        'epMap', 'epStateStore', 'epPainterStore', 'epGeometryEditorStore', 'epFeatureStore', 'epFeatureManager'
    ];

    function StateManager(map:ol.Map,
                          store:StateStore,
                          painterStore:editor.paint.PainterStore,
                          editorStore:editor.geometry.EditorStore,
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
        layers.on(changeEvent(ol.CollectionProperty.LENGTH), _.debounce(setLevelThreshold, 200));
        painterStore.selected.add(_.partial(invalidateGeometryMode, State.GEOMETRY_PAINTING));
        editorStore.selected.add(_.partial(invalidateGeometryMode, State.GEOMETRY_MODIFYING));
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
            invalidateLevel();
        }

        function invalidateLevel():void {
            store.currentLevel = view.getResolution() < threshold ? State.DETAIL : State.OVERVIEW;
        }

        function invalidateGeometryMode(mode:State, type:any):void {
            store.currentGeometryMode = type === undefined ? -1 : mode;
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
