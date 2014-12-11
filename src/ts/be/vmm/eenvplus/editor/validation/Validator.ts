///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.validation.validator {
    'use strict';

    export var NAME:string = PREFIX + 'Validator';

    function configure():ng.IDirective {
        ValidatorController.$inject = ['$scope', 'epFeatureManager'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: ValidatorController,
            templateUrl: 'html/be/vmm/eenvplus/editor/validation/Validator.html'
        };
    }

    class ValidatorController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public results:FeatureResult[];
        public isValid:boolean = true;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(scope:ng.IScope, manager:feature.FeatureManager) {
            _.bindAll(this);

            scope.$on(applicationState.EVENT.modeRequest, handle(this.handleModeChange));
            manager.signal.validate.add(this.handleValidation);
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        private handleValidation(result:ValidationResult):void {
            this.isValid = result.valid;
            this.results = result.results;
        }

        private handleModeChange(state:applicationState.State):void {
            if (state === applicationState.State.OVERVIEW) this.isValid = true;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
