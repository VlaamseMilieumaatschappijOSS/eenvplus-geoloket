///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.sewerForm {
    'use strict';

    export var NAME:string = PREFIX + 'SewerForm';

    function configure():ng.IDirective {
        SewerFormController.$inject = ['epLabelService'];

        return {
            restrict: 'A',
            require: 'form',
            scope: {
                data: '='
            },
            bindToController: true,
            controllerAs: 'ctrl',
            controller: SewerFormController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/form/SewerForm.html',
            link: injectValidator
        };
    }

    class SewerFormController {

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
        public selectedWaterType:label.Label;
        public waterTypes:Array<label.Label>;
        public isInteger:RegExp = /^\d*$/;
        public max2Decimals:RegExp = /^\d+(,|\.\d{1,2})?$/;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(labelService:label.LabelService) {
            this.sources = labelService.getLabels(label.LabelType.SOURCE);
            this.types = labelService.getLabels(label.LabelType.SEWER_TYPE);
            this.waterTypes = labelService.getLabels(label.LabelType.WATER_TYPE);

            label.proxy(this, this.data.properties)
                .map(this.sources, 'selectedSource', 'namespaceId')
                .map(this.types, 'selectedType', 'rioolLinkTypeId')
                .map(this.waterTypes, 'selectedWaterType', 'sewerWaterTypeId');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
