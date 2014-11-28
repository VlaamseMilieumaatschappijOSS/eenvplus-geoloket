///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.state {
    'use strict';

    export var NAME:string = 'gaState';

    export var EVENT = {
        modeChange: 'modeStateChange',
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
            controller: StateController
        };
    }

    StateController.$inject = ['$scope'];

    export function StateController(scope:ApplicationScope) {

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

        // not particularly type-safe but it's the easiest way to hook into the main app without touching it
        scope.$watch('globals.isDrawActive', setMode);
        view.on('change:resolution', invalidateLevel);
        layers.on('change:length', setLevelThreshold);

        invalidateViewState();


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function setLevelThreshold():void {
            var resolutions = _(scope.map.getLayers().getArray())
                .filter('displayInLayerManager')
                .invoke(ol.layer.Base.prototype.get, 'maxResolution')
                .value();
            threshold = Math.min.apply(null, resolutions);
        }

        function setMode(editActive:boolean):void {
            var mode = editActive ? State.EDIT : State.VIEW;
            if (mode === currentState.mode) return;

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
            scope.state = _.map(currentState, (state) => {
                return stateCls[state];
            }).join(' ');
        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
