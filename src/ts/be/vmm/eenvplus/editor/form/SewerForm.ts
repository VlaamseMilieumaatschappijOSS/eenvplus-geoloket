///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.sewerForm {
    'use strict';

    export var NAME:string = PREFIX + 'SewerForm';

    interface Scope extends ng.IScope {

    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: SewerFormController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/SewerForm.html'
        };
    }

    SewerFormController.$inject = ['$scope'];

    function SewerFormController(scope:Scope):void {

        _.merge(scope, {});

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
