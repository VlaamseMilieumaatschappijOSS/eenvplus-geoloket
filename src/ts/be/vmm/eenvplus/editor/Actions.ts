///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated
///ts:ref=FeatureService
/// <reference path="../feature/FeatureService.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.actions {
    'use strict';

    export var NAME:string = PREFIX + 'EditActions';

    function configure():ng.IDirective {
        ActionsController.$inject = ['epStateStore', 'epFeatureManager'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: ActionsController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/Actions.html'
        };
    }


    class ActionsController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        private state:state.StateStore;
        private manager:feature.FeatureManager;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(state:state.StateStore, manager:feature.FeatureManager) {
            this.state = state;
            this.manager = manager;

            this.validate = manager.validate;
            this.save = _.compose(this.discard.bind(this), manager.push);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public validate:Function;
        public save:Function;

        public discard():void {
            this.state.currentMode = state.State.VIEW;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
