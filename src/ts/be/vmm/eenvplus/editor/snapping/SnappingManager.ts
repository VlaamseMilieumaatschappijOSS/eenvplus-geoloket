///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';


    SnappingManager.$inject = ['epSnappingStore', 'epStateStore'];

    function SnappingManager(store:SnappingStore, state:state.StateStore):void {
        var previous = store.current;

        // store the previously selected SnappingType
        store.selected.add((type:SnappingType):void => {
            if (type !== undefined) previous = type;
        });

        // when a geometry mode is selected, restore the previously selected SnappingType
        // when geometry mode is deselected, also deselect the current SnappingType
        // (which will deactivate the current snapping strategy)
        state.geometryModeChanged.add((mode:state.State):void => {
            store.current = mode === -1 ? undefined : previous;
        });
    }

    angular
        .module(MODULE)
        .run(SnappingManager);

}
