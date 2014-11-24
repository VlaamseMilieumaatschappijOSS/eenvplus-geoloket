///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.state {
    'use strict';

    export var NAME:string = 'gaState';

    export var EVENT = {
        change: 'stateChange'
    };

    var state = {
        VIEW: 'view',
        EDIT: 'edit'
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

    export function StateController($scope:Scope, $rootScope:ng.IScope) {
        // not particularly type-safe but it's the easiest way to hook into the main app without touching it
        $scope.$watch('globals.isDrawActive', toggle);

        function toggle(editActive) {
            $scope.state = editActive ? state.EDIT : state.VIEW;
            $rootScope.$broadcast(EVENT.change, $scope.state);
        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
