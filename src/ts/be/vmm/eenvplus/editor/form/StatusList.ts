///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.StatusList {
    'use strict';

    export var NAME:string = PREFIX + 'FeatureStatusList';

    interface Scope extends ng.IScope {
        data:feature.model.Status[];
    }

    function configure():ng.IDirective {
        StatusListController.$inject = ['$scope'];

        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            controllerAs: 'ctrl',
            controller: StatusListController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/StatusList.html'
        };
    }

    class StatusListController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public data:feature.model.Status[];


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(scope:Scope) {
            this.data = scope.data;
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public addStatus() {
            this.data.push(<feature.model.Status> {});
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
