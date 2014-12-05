///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.appurtenanceForm {
    'use strict';

    export var NAME:string = PREFIX + 'AppurtenanceForm';

    interface Scope extends ng.IScope {
        data:feature.model.RioolAppurtenance;
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
        scope.selectedType = _.find(scope.sources, {id: scope.data.rioolAppurtenanceTypeId});

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
