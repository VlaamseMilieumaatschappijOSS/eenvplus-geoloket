///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.applicationState {
    'use strict';

    export var NAME:string = PREFIX + 'ApplicationState';

    export enum State {
        VIEW,
        EDIT,
        FEATURE_SELECTED,
        OVERVIEW,
        DETAIL
    }

    var stateCls = [
        'view',
        'edit',
        'feature-selected',
        'overview',
        'detail'
    ];

    /**
     * Can't isolate the scope because we need a way to hook into the body without touching the original code.
     *
     * @returns The State directive configuration.
     */
    function configure():ng.IDirective {
        ApplicationStateController.$inject = ['epStateStore'];

        return {
            restrict: 'A',
            controllerAs: 'ctrl',
            controller: ApplicationStateController
        };
    }

    class ApplicationStateController {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        private state:StateStore;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        constructor(state:StateStore) {
            this.state = state;
            state.modeChanged.add(ApplicationStateController.updateState);
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        private static updateState(mode:State):void {
            // FIXME hard reference
            if (mode !== State.EDIT) $('#drawTools').collapse('hide');
        }

        public getState():string {
            if (!this.state) return '';

            return _.map(this.state.current, (state:State):string => {
                return stateCls[state];
            }).join(' ');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
