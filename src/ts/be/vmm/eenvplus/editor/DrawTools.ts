///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.drawTools {
    'use strict';

    export var NAME:string = PREFIX + 'DrawTools';

    interface Scope extends ng.IScope {
        requestEditMode:() => void;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: DrawToolsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/DrawTools.html'
        };
    }

    DrawToolsController.$inject = ['$scope', '$rootScope'];

    function DrawToolsController(scope:Scope, rootScope:ng.IScope) {

        scope.requestEditMode = requestEditMode;

        function requestEditMode():void {
            rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.EDIT);
        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
