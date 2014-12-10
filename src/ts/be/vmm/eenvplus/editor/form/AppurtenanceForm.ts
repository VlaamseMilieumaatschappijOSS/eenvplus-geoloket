///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.appurtenanceForm {
    'use strict';

    export var NAME:string = PREFIX + 'AppurtenanceForm';

    interface Scope extends ng.IScope {
        data:feature.model.FeatureJSON;
        form:ng.IFormController;
        selectedSource:label.Label;
        sources:Array<label.Label>;
        selectedType:label.Label;
        types:Array<label.Label>;

        discard:(json:feature.model.FeatureJSON) => void;
        commit:(json:feature.model.FeatureJSON) => void;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            controller: AppurtenanceFormController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/AppurtenanceForm.html'
        };
    }

    AppurtenanceFormController.$inject = ['$scope', 'epLabelService', 'epFeatureManager'];

    function AppurtenanceFormController(scope:Scope, labelService:label.LabelService, manager:feature.FeatureManager):void {
        scope.sources = labelService.getLabels(label.LabelType.SOURCE);
        scope.types = labelService.getLabels(label.LabelType.APPURTENANCE_TYPE);

        _.merge(scope, {
            discard: _.partial(manager.discard, scope.data),
            commit: commit
        });

        label.proxy(scope, scope.data.properties)
            .map(scope.sources, 'selectedSource', 'namespaceId')
            .map(scope.types, 'selectedType', 'rioolAppurtenanceTypeId');

        function commit() {
            if (scope.form.$valid) manager.update(scope.data);
            else _(scope.form)
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
