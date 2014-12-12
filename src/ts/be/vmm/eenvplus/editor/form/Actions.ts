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
            scope: {
                data: '='
            },
            bindToController: true,
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
        private data:feature.model.FeatureJSON;
        /** @inject */
        private validate:Validator;
        private manager:feature.FeatureManager;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(manager:feature.FeatureManager) {
            this.manager = manager;
            this.discard = _.partial(manager.discard, this.data);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public discard:(json:feature.model.FeatureJSON) => void;

        public commit() {
            if (this.validate.valid()) this.manager.update(this.data);
            else this.validate.setDirty();
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
