///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.drawTools {
    'use strict';

    export var NAME:string = PREFIX + 'DrawTools';

    interface Scope extends ng.IScope {

    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: DrawToolsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/DrawTools.html'
        };
    }

    DrawToolsController.$inject = ['$scope'];

    function DrawToolsController(scope:Scope) {



    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
