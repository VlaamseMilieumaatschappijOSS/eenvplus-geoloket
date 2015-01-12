///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.viewer.GMLImport {
    'use strict';

    export var NAME:string = PREFIX + 'GmlImport';

    function configure():ng.IDirective {
        GMLImportController.$inject = ['epUser'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: GMLImportController,
            templateUrl: 'ts/be/vmm/eenvplus/viewer/GMLImport.html'
        };
    }

    class GMLImportController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public get hasPermission():boolean {
            return this.user.authenticated;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(private user:user.User) {
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
