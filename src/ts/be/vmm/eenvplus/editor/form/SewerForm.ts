///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.sewerForm {
    'use strict';

    export var NAME:string = PREFIX + 'SewerForm';

    interface Scope extends ng.IScope {
        data:feature.model.RioolLink;
        selectedSource:Label;
        sources:Label[];
        selectedType:Label;
        types:Label[];
        selectedWaterType:Label;
        waterTypes:Label[];
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

    SewerFormController.$inject = ['$scope'];

    function SewerFormController(scope:Scope):void {

        _.merge(scope, {
            sources: [
                {id: 1, label: 'Aquafin'},
                {id: 2, label: 'Gemeente'},
                {id: 3, label: 'Andere'},
                {id: 4, label: 'Privé'}
            ],
            types: [
                {id: 1, label: 'ConnectionStreng'},
                {id: 2, label: 'gravity duct'},
                {id: 3, label: 'pressure duct'},
                {id: 4, label: 'ditch'}
            ],
            waterTypes: [
                {id: 1, label: 'combined'},
                {id: 2, label: 'reclaimed'},
                {id: 3, label: 'sanitary'},
                {id: 4, label: 'storm'}
            ]
        });

        scope.selectedSource = _.find(scope.sources, {id: scope.data.namespaceId});

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
