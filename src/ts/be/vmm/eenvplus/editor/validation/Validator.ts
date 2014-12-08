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

        manager.signal.validate.add(handleValidation);

        function handleValidation(result:ValidationResult):void {
            scope.isValid = result.valid;
            scope.results = result.results;
            console.log(scope.results.length);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
