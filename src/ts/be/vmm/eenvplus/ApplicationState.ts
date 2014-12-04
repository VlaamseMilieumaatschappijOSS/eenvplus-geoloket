///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.applicationState {
    'use strict';

    export var NAME:string = PREFIX + 'ApplicationState';

    export var EVENT = {
        modeChange: 'modeStateChange',
        modeRequest: 'modeRequest',
        levelChange: 'levelStateChange'
    };

    export enum State {
        VIEW,
        EDIT,
        OVERVIEW,
        DETAIL
    }

    var stateCls = [
        'view',
        'edit',
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

    ApplicationStateController.$inject = ['$scope'];

    export function ApplicationStateController(scope:ApplicationScope) {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var view = scope.map.getView(),
            layers = scope.map.getLayers(),
            currentState = {
                mode: State.VIEW,
                level: State.OVERVIEW
            },
            threshold:number;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        scope.$on(EVENT.modeRequest, handle(handleModeRequest));
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
            var resolutions = _(scope.map.getLayers().getArray())
                .filter('displayInLayerManager')
                .invoke(ol.layer.Base.prototype.get, ol.layer.LayerProperty.MAX_RESOLUTION)
                .value();
            threshold = Math.max.apply(null, resolutions);
        }

        function setMode(editActive:boolean):void {
            var mode = editActive ? State.EDIT : State.VIEW;
            if (mode === currentState.mode) return;

            // FIXME hard reference
            if (!editActive) $('#drawTools').collapse('hide');

            scope.$broadcast(EVENT.modeChange, currentState.mode = mode);
            invalidateViewState();
        }

        function invalidateLevel():void {
            var level = view.getResolution() < threshold ? State.DETAIL : State.OVERVIEW;
            if (level === currentState.level) return;

            scope.$broadcast(EVENT.levelChange, currentState.level = level);
            invalidateViewState();
        }

        function invalidateViewState():void {
            scope.state = _.map(currentState, (state:State):string => {
                return stateCls[state];
            }).join(' ');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
