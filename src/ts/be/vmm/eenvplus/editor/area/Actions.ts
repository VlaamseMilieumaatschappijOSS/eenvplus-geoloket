///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated
///ts:ref=FeatureService
/// <reference path="../../feature/FeatureService.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.area.actions {
    'use strict';

    export var NAME:string = PREFIX + 'EditActions';

    function configure():ng.IDirective {
        ActionsController.$inject = ['$timeout', 'epStateStore', 'epAreaStore', 'epFeatureManager'];

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

        public hasValidated:boolean;
        public messageDelay:number = 3000;

        public get hasArea():boolean {
            return !!this.store.current;
        }


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(private delay:ng.ITimeoutService,
                    private state:state.StateStore,
                    private store:AreaStore,
                    manager:feature.FeatureManager) {

            _.bindAll(this);

            this.validate = manager.validate;
            this.save = _.compose(this.discard, manager.push);

            manager.validated.add(_.compose(this.toggleValidationMessage, get('valid')));
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        public validate:() => void;
        public save:() => void;

        public discard():void {
            this.state.currentMode = state.State.VIEW;
        }

        public toggleValidationMessage(show:boolean = false):void {
            this.hasValidated = show;
            if (show) this.delay(this.toggleValidationMessage, this.messageDelay);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
