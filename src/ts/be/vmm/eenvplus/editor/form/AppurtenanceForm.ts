///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.appurtenanceForm {
    'use strict';

    export var NAME:string = PREFIX + 'AppurtenanceForm';

    interface Scope extends ng.IScope {
        data:feature.model.FeatureJSON;
        form:ng.IFormController;
    }

    function configure():ng.IDirective {
        AppurtenanceFormController.$inject = ['$scope', 'epLabelService', 'epFeatureManager'];

        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            controllerAs: 'ctrl',
            controller: AppurtenanceFormController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/AppurtenanceForm.html'
        };
    }

    class AppurtenanceFormController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public data:feature.model.FeatureJSON;
        public form:ng.IFormController;
        public selectedSource:label.Label;
        public sources:Array<label.Label>;
        public selectedType:label.Label;
        public types:Array<label.Label>;

        private manager:feature.FeatureManager;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(scope:Scope, labelService:label.LabelService, manager:feature.FeatureManager) {
            this.manager = manager;
            this.data = scope.data;
            this.sources = labelService.getLabels(label.LabelType.SOURCE);
            this.types = labelService.getLabels(label.LabelType.APPURTENANCE_TYPE);

            Object.defineProperty(scope, 'form', {
                set: (value:ng.IFormController):void => {
                    this.form = value;
                }
            });

            label.proxy(this, this.data.properties)
                .map(this.sources, 'selectedSource', 'namespaceId')
                .map(this.types, 'selectedType', 'rioolAppurtenanceTypeId');

            this.discard = _.partial(manager.discard, this.data);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

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
