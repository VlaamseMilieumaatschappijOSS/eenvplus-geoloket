///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    InteractiveStrategy.$inject = ['epSnappingState'];

    function InteractiveStrategy(state:StateController<SnappingType>):void {


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.INTERACTIVE, activate, deactivate);


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate() {
            alert('InteractiveStrategy to be implemented!');
        }

        function deactivate() {

        }

    }

    angular
        .module(MODULE)
        .run(InteractiveStrategy);

}
