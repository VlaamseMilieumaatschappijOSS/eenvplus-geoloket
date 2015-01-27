///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.validation.validator {
    'use strict';

    export var NAME:string = PREFIX + 'Validator';

    function configure():ng.IDirective {
        ValidatorController.$inject = ['epFeatureManager', 'epStateStore'];

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

        private get isEdit():boolean {
            return this.stateStore.currentMode === state.State.EDIT;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(private manager:feature.FeatureManager,
                    private stateStore:state.StateStore) {

            manager.validated.add(this.handleValidation.bind(this));
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        private handleValidation(result:ValidationResult):void {
            this.results = result.results;
        }

        public highlight(result:FeatureResult):void {
            if (this.isEdit)
                this.manager
                    .get(result.layerBodId, result.key)
                    .then(this.manager.emphasize);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public removeHighlight():void {
            if (this.isEdit) this.manager.emphasize(null);
        }

        public select(result:FeatureResult):void {
            this.manager
                .get(result.layerBodId, result.key)
                .then(this.manager.select);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
