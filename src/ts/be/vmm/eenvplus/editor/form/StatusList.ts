///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.StatusList {
    'use strict';

    export var NAME:string = PREFIX + 'FeatureStatusList';

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            bindToController: true,
            controllerAs: 'ctrl',
            controller: StatusListController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/StatusList.html'
        };
    }

    class StatusListController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        /** @inject */
        public data:feature.model.Status[];


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
