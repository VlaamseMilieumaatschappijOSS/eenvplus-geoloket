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
            link: linkForm
        };
    }

    class ActionsController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        /** @inject */
        private data:feature.model.FeatureJSON;
        /** @inject */
        private form:ng.IFormController;
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
            if (this.form.$valid) this.manager.update(this.data);
            else _(this.form)
                .reject((value:ng.INgModelController, key:string):boolean => {
                    return key.indexOf('$') === 0;
                })
                .each((value:ng.INgModelController):void => {
                    value.$dirty = true;
                });
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
