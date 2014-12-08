///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.validation.validator {
    'use strict';

    export var NAME:string = PREFIX + 'Validator';

    interface Scope extends ng.IScope {
        isValid:boolean;
        results:FeatureResult[];
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: ValidatorController,
            templateUrl: 'html/be/vmm/eenvplus/editor/validation/Validator.html'
        };
    }

    ValidatorController.$inject = ['$scope', 'epFeatureManager'];

    function ValidatorController(scope:Scope, manager:feature.FeatureManager):void {

        _.merge(scope, {
            isValid: true
        });

        scope.$on(applicationState.EVENT.modeRequest, handle(handleModeChange));
        manager.signal.validate.add(handleValidation);

        function handleValidation(result:ValidationResult):void {
            scope.isValid = result.valid;
            scope.results = result.results;
        }

        function handleModeChange(state:applicationState.State):void {
            if (state === applicationState.State.OVERVIEW) scope.isValid = true;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
