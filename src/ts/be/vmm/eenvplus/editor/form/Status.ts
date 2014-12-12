///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.Status {
    'use strict';

    export var NAME:string = PREFIX + 'FeatureStatus';

    function configure():ng.IDirective {
        StatusController.$inject = ['epLabelService'];

        return {
            restrict: 'A',
            require: '^form',
            scope: {
                data: '='
            },
            bindToController: true,
            controllerAs: 'ctrl',
            controller: StatusController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/Status.html',
            link: injectValidator
        };
    }

    class StatusController {

        private static counter:number = 0;

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public uid:number = StatusController.counter++;
        /** @inject */
        public data:feature.model.Status;
        /** @inject */
        public validate:Validator;
        public types:Array<label.Label>;
        public selectedStatus:label.Label;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(labelService:label.LabelService) {
            this.types = labelService.getLabels(label.LabelType.STATUS);

            label.proxy(this, this.data)
                .map(this.types, 'selectedStatus', 'statusId');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
