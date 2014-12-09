///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.appurtenanceForm {
    'use strict';

    export var NAME:string = PREFIX + 'AppurtenanceForm';

    interface Scope extends ng.IScope {
        data:feature.model.RioolAppurtenance;
        form:ng.IFormController;
        selectedSource:label.Label;
        sources:Array<label.Label>;
        selectedType:label.Label;
        types:Array<label.Label>;
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

    AppurtenanceFormController.$inject = ['$scope', 'epLabelService'];

    function AppurtenanceFormController(scope:Scope, labelService:label.LabelService):void {

        scope.sources = labelService.getLabels(label.LabelType.SOURCE);
        scope.types = labelService.getLabels(label.LabelType.APPURTENANCE_TYPE);

        scope.data = scope.data || <feature.model.RioolAppurtenance> {};
        scope.selectedSource = _.find(scope.sources, {id: scope.data.namespaceId});
        scope.selectedType = _.find(scope.sources, {id: scope.data.rioolAppurtenanceTypeId});

        scope.$watch(updateModel);

        function updateModel():void {
            scope.data.namespaceId = scope.selectedSource ? scope.selectedSource.id : undefined;
            scope.data.rioolAppurtenanceTypeId = scope.selectedType ? scope.selectedType.id : undefined;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
