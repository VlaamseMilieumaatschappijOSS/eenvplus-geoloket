///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.appurtenanceForm {
    'use strict';

    export var NAME:string = PREFIX + 'AppurtenanceForm';

    interface Scope extends ng.IScope {
        data:feature.model.RioolAppurtenance;
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

    AppurtenanceFormController.$inject = ['$scope'];

    function AppurtenanceFormController(scope:Scope):void {

        _.merge(scope, {});

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
