///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.validation.validator {
    'use strict';

    export var NAME:string = PREFIX + 'Validator';

    function configure():ng.IDirective {
        ValidatorController.$inject = ['epFeatureManager'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: ValidatorController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/validation/Validator.html'
        };
    }

    class ValidatorController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public results:FeatureResult[];


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(manager:feature.FeatureManager) {
            manager.signal.validate.add(this.handleValidation.bind(this));
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        private handleValidation(result:ValidationResult):void {
            this.results = result.results;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
