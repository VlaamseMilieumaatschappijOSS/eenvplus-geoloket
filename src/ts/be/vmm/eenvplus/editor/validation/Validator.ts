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

        constructor(private manager:feature.FeatureManager) {
            manager.signal.validate.add(this.handleValidation.bind(this));
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        private handleValidation(result:ValidationResult):void {
            this.results = result.results;
        }

        public highlight(result:FeatureResult):void {
            this.manager
                .get(result.layerBodId, result.key)
                .then(this.manager.emphasize);
        }

        public removeHighlight():void {
            this.manager.emphasize(null);
        }

        public select(result:FeatureResult):void {
            if (feature.isType(feature.FeatureType.NODE, result.layerBodId)) return;

            this.manager
                .get(result.layerBodId, result.key)
                .then(this.manager.select);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
