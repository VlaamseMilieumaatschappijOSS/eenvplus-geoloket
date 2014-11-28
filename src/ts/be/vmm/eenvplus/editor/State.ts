///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.state {
    'use strict';

    export var NAME:string = 'gaState';

    export var EVENT = {
        modeChange: 'modeStateChange',
        levelChange: 'levelStateChange'
    };

    export var STATE = {
        VIEW: 'view',
        EDIT: 'edit',
        OVERVIEW: 'overview',
        DETAIL: 'detail'
    };

    interface Scope extends ng.IScope {
        state:string;
    }

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
        // not particularly type-safe but it's the easiest way to hook into the main app without touching it
        scope.$watch('globals.isDrawActive', toggle);

        function toggle(editActive) {
            scope.state = editActive ? STATE.EDIT : STATE.VIEW;
            scope.$broadcast(EVENT.modeChange, scope.state);
        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
