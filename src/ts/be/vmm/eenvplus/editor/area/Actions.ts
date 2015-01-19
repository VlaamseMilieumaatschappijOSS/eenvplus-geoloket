///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated
///ts:ref=FeatureService
/// <reference path="../../feature/FeatureService.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area.actions {
    'use strict';

    export var NAME:string = PREFIX + 'EditActions';

    function configure():ng.IDirective {
        ActionsController.$inject = ['epStateStore', 'epAreaStore', 'epFeatureManager'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: ActionsController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/area/Actions.html'
        };
    }


    class ActionsController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        public get hasArea():boolean {
            return !!this.store.current;
        }

        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(private state:state.StateStore,
                    private store:AreaStore,
                    manager:feature.FeatureManager) {

            this.validate = manager.validate;
            this.save = _.compose(this.discard.bind(this), manager.push);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public validate:() => void;
        public save:() => void;

        public discard():void {
            this.state.currentMode = state.State.VIEW;
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
