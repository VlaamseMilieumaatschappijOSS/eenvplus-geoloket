///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.applicationState {
    'use strict';

    export var NAME:string = PREFIX + 'ApplicationState';

    export enum State {
        VIEW,
        EDIT,
        FEATURE_SELECTED,
        OVERVIEW,
        DETAIL
    }

    var stateCls = [
        'view',
        'edit',
        'feature-selected',
        'overview',
        'detail'
    ];

    /**
     * Can't isolate the scope because we need a way to hook into the main application.
     *
     * @returns The State directive configuration.
     */
    function configure():ng.IDirective {
        return {
            restrict: 'A',
            controller: ApplicationStateController
        };
    }

    ApplicationStateController.$inject = ['$scope', 'epMap', 'epStateStore', 'epFeatureStore'];

    export function ApplicationStateController(scope:ApplicationScope, map:ol.Map, state:StateStore, featureStore:feature.FeatureStore):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var view = map.getView(),
            layers = map.getLayers(),
            threshold:number;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state.modeChanged.add(handleModeRequest);
        featureStore.selected.add(invalidateFeatureSelection);
        view.on(changeEvent(ol.ViewProperty.RESOLUTION), invalidateLevel);
        layers.on(changeEvent(ol.CollectionProperty.LENGTH), setLevelThreshold);

        invalidateViewState();


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleModeRequest(mode:State):void {
            setMode(mode === State.EDIT);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function setLevelThreshold():void {
            var resolutions = _(map.getLayers().getArray())
                .filter('displayInLayerManager')
                .invoke(ol.layer.Base.prototype.get, ol.layer.LayerProperty.MAX_RESOLUTION)
                .value();
            threshold = Math.max.apply(null, resolutions);
        }

        function setMode(editActive:boolean):void {
            var mode = editActive ? State.EDIT : State.VIEW;

            // FIXME hard reference
            if (!editActive) $('#drawTools').collapse('hide');

            state.currentMode = mode;
            invalidateViewState();
        }

        function invalidateLevel():void {
            state.currentLevel = view.getResolution() < threshold ? State.DETAIL : State.OVERVIEW;
            invalidateViewState();
        }

        function invalidateFeatureSelection(feature:feature.model.FeatureJSON):void {
            state.featureSelected = feature ? State.FEATURE_SELECTED : -1;
            invalidateViewState();
        }

        function invalidateViewState():void {
            scope.state = _.map(state.current, (state:State):string => {
                return stateCls[state];
            }).join(' ');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
