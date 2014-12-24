module be.vmm.eenvplus.editor.area {
    'use strict';

    AreaManager.$inject = ['epAreaStore', 'epStateStore'];

    function AreaManager(store:AreaStore, state:state.StateStore):void {
        state.modeChanged.add(():void => {
            store.current = undefined;
        });
    }

    angular
        .module(MODULE)
        .run(AreaManager);

}
