///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.sewerForm {
    'use strict';

    export var NAME:string = PREFIX + 'SewerForm';

    interface Scope extends ng.IScope {
        data:feature.model.FeatureJSON;
        form:ng.IFormController;
    }

    function configure():ng.IDirective {
        SewerFormController.$inject = ['$scope', 'epLabelService'];

        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            controllerAs: 'ctrl',
            controller: SewerFormController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/SewerForm.html'
        };
    }

    class SewerFormController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public data:feature.model.FeatureJSON;
        public form:ng.IFormController;
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

        constructor(scope:Scope, labelService:label.LabelService) {
            this.data = scope.data;
            this.sources = labelService.getLabels(label.LabelType.SOURCE);
            this.types = labelService.getLabels(label.LabelType.SEWER_TYPE);
            this.waterTypes = labelService.getLabels(label.LabelType.WATER_TYPE);

            Object.defineProperty(scope, 'form', {
                set: (value:ng.IFormController):void => {
                    this.form = value;
                }
            });

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
