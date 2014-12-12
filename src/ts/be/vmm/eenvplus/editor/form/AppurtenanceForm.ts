///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.appurtenanceForm {
    'use strict';

    export var NAME:string = PREFIX + 'AppurtenanceForm';

    function configure():ng.IDirective {
        AppurtenanceFormController.$inject = ['epLabelService'];

        return {
            restrict: 'A',
            require: 'form',
            scope: {
                data: '='
            },
            bindToController: true,
            controllerAs: 'ctrl',
            controller: AppurtenanceFormController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/AppurtenanceForm.html',
            link: injectValidator
        };
    }

    class AppurtenanceFormController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        /** @inject */
        public data:feature.model.FeatureJSON;
        /** @inject */
        public validate:Validator;
        public selectedSource:label.Label;
        public sources:Array<label.Label>;
        public selectedType:label.Label;
        public types:Array<label.Label>;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(labelService:label.LabelService) {
            this.sources = labelService.getLabels(label.LabelType.SOURCE);
            this.types = labelService.getLabels(label.LabelType.APPURTENANCE_TYPE);

            label.proxy(this, this.data.properties)
                .map(this.sources, 'selectedSource', 'namespaceId')
                .map(this.types, 'selectedType', 'rioolAppurtenanceTypeId');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
