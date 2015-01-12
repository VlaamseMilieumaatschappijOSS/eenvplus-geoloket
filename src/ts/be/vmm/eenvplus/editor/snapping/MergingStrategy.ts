///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    MergingStrategy.$inject = ['epSnappingState'];

    function MergingStrategy(state:StateController<SnappingType>):void {


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(SnappingType.MERGE, activate, deactivate);


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
        .run(MergingStrategy);

}
