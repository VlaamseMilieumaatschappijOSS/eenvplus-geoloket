///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated
///ts:ref=FeatureService
/// <reference path="../feature/FeatureService.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.actions {
    'use strict';

    export var NAME:string = PREFIX + 'EditActions';

    function configure():ng.IDirective {
        ActionsController.$inject = ['$rootScope', 'epFeatureManager'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: ActionsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/Actions.html'
        };
    }


    class ActionsController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        private rootScope:ng.IScope;
        private manager:feature.FeatureManager;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(rootScope:ng.IScope, manager:feature.FeatureManager) {
            this.rootScope = rootScope;
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
            this.rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.OVERVIEW);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
