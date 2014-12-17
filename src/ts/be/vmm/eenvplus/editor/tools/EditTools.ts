///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.tools.EditTools {
    'use strict';

    export var NAME:string = PREFIX + 'EditTools';

    function configure():ng.IDirective {
        EditToolsController.$inject = [];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: EditToolsController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/tools/EditTools.html'
        };
    }

    class EditToolsController {

        constructor() {

        }

        public move() {

        }

        public cut() {

        }

        public add() {

        }

        public remove() {

        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
