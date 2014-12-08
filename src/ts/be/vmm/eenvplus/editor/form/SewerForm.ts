///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.sewerForm {
    'use strict';

    export var NAME:string = PREFIX + 'SewerForm';

    interface Scope extends ng.IScope {
        data:feature.model.RioolLink;
        selectedSource:label.Label;
        sources:Array<label.Label>;
        selectedType:label.Label;
        types:Array<label.Label>;
        selectedWaterType:label.Label;
        waterTypes:Array<label.Label>;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            controller: SewerFormController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/SewerForm.html'
        };
    }

    SewerFormController.$inject = ['$scope', 'epLabelService'];

    function SewerFormController(scope:Scope, labelService:label.LabelService):void {

        scope.sources = labelService.getLabels(label.LabelType.SOURCE);
        scope.types = labelService.getLabels(label.LabelType.SEWER_TYPE);
        scope.waterTypes = labelService.getLabels(label.LabelType.WATER_TYPE);

        scope.data = scope.data || <feature.model.RioolLink> {};
        scope.selectedSource = _.find(scope.sources, {id: scope.data.namespaceId});
        scope.selectedType = _.find(scope.types, {id: scope.data.rioolLinkTypeId});
        scope.selectedWaterType = _.find(scope.waterTypes, {id: scope.data.sewerWaterTypeId});

        scope.$watch(updateModel);

        function updateModel():void {
            scope.data.namespaceId = scope.selectedSource ? scope.selectedSource.id : undefined;
            scope.data.rioolLinkTypeId = scope.selectedType ? scope.selectedType.id : undefined;
            scope.data.sewerWaterTypeId = scope.selectedWaterType ? scope.selectedWaterType.id : undefined;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
