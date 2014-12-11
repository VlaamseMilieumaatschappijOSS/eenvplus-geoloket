///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.form.Actions {
    'use strict';

    export var NAME:string = PREFIX + 'FormActions';

    interface Scope extends ng.IScope {
        data:feature.model.FeatureJSON;
        form:ng.IFormController;
    }

    function configure():ng.IDirective {
        ActionsController.$inject = ['$scope', 'epFeatureManager'];

        return {
            restrict: 'A',
            scope: {
                data: '=',
                form: '='
            },
            controllerAs: 'ctrl',
            controller: ActionsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/form/Actions.html'
        };
    }

    class ActionsController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        private data:feature.model.FeatureJSON;
        private form:ng.IFormController;
        private manager:feature.FeatureManager;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(scope:Scope, manager:feature.FeatureManager) {
            this.data = scope.data;
            this.form = scope.form;
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
