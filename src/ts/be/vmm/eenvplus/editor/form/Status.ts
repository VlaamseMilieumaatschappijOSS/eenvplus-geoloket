///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.Status {
    'use strict';

    export var NAME:string = PREFIX + 'FeatureStatus';

    interface Scope extends ng.IScope {
        data:feature.model.Status;
    }

    function configure():ng.IDirective {
        StatusController.$inject = ['$scope', 'epLabelService'];

        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            controllerAs: 'ctrl',
            controller: StatusController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/Status.html'
        };
    }

    class StatusController {

        public data:feature.model.Status;
        public types:Array<label.Label>;
        public selectedStatus:label.Label;

        constructor(scope:Scope, labelService:label.LabelService) {
            this.data = scope.data;
            this.types = labelService.getLabels(label.LabelType.STATUS);

            label.proxy(this, this.data)
                .map(this.types, 'selectedStatus', 'statusId');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
