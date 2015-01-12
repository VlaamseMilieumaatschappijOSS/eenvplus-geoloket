///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    AddingStrategy.$inject = ['epSnappingState'];

    function AddingStrategy(state:StateController<SnappingType>):void {

        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.ADD, activate, deactivate);


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate() {

        }

        function deactivate() {

        }

    }

    angular
        .module(MODULE)
        .run(AddingStrategy);

}
