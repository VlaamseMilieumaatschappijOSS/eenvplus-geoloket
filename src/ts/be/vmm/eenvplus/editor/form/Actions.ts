///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.Actions {
    'use strict';

    export var NAME:string = PREFIX + 'FormActions';

    function configure():ng.IDirective {
        ActionsController.$inject = ['epFeatureManager'];

        return {
            restrict: 'A',
            require: '^form',
            scope: {},
            controllerAs: 'ctrl',
            controller: ActionsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/Actions.html',
            link: injectValidator
        };
    }

    class ActionsController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        /** @inject */
        private validate:Validator;
        private manager:feature.FeatureManager;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(manager:feature.FeatureManager) {
            this.manager = manager;
            this.discard = manager.discard;
            this.remove = manager.remove;
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public discard:() => void;
        public remove:() => void;

        public commit() {
            if (this.validate.valid()) this.manager.update();
            else this.validate.setDirty();
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
