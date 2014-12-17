///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.validation.validator {
    'use strict';

    export var NAME:string = PREFIX + 'Validator';

    function configure():ng.IDirective {
        ValidatorController.$inject = ['epStateStore', 'epFeatureManager'];

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

        public get isActive():boolean {
            return this.state.currentLevel === state.State.DETAIL && !this.valid;
        }

        private state:state.StateStore;
        private valid:boolean = true;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(state:state.StateStore, manager:feature.FeatureManager) {
            this.state = state;
            manager.signal.validate.add(this.handleValidation.bind(this));
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        private handleValidation(result:ValidationResult):void {
            this.valid = result.valid;
            this.results = result.results;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
