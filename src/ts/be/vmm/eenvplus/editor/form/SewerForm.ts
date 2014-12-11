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
        SewerFormController.$inject = ['$scope', 'epLabelService', 'epFeatureManager'];

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
        public properties:feature.model.RioolLink;
        public form:ng.IFormController;
        public selectedSource:label.Label;
        public sources:Array<label.Label>;
        public selectedType:label.Label;
        public types:Array<label.Label>;
        public selectedWaterType:label.Label;
        public waterTypes:Array<label.Label>;
        public isInteger:RegExp = /^\d*$/;
        public max2Decimals:RegExp = /^\d+(,|\.\d{1,2})?$/;

        private manager:feature.FeatureManager;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(scope:Scope, labelService:label.LabelService, manager:feature.FeatureManager) {
            this.manager = manager;
            this.data = scope.data;
            this.properties = <feature.model.RioolLink> this.data.properties;
            this.sources = labelService.getLabels(label.LabelType.SOURCE);
            this.types = labelService.getLabels(label.LabelType.SEWER_TYPE);
            this.waterTypes = labelService.getLabels(label.LabelType.WATER_TYPE);

            Object.defineProperty(scope, 'form', {
                set: (value:ng.IFormController):void => {
                    this.form = value;
                }
            });

            label.proxy(this, this.properties)
                .map(this.sources, 'selectedSource', 'namespaceId')
                .map(this.types, 'selectedType', 'rioolLinkTypeId')
                .map(this.waterTypes, 'selectedWaterType', 'sewerWaterTypeId');

            this.discard = _.partial(manager.discard, this.data);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public addStatus() {
            this.properties.statussen.push(<feature.model.Status> {});
        }

        public discard:(json:feature.model.FeatureJSON) => void;

        public commit() {
            if (this.form.$valid) this.manager.update(this.data);
            else _(this.form)
                .reject((value:ng.INgModelController, key:string):boolean => {
                    return key.indexOf('$') === 0;
                })
                .each((value:ng.INgModelController):void => {
                    value.$dirty = true;
                });
        }
    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
