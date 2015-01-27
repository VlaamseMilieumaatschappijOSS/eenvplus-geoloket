module be.vmm.eenvplus.editor.geometry {
    'use strict';

    EditorManager.$inject = ['epGeometryEditorStore', 'epFeatureSignals'];

    function EditorManager(store:EditorStore, featureSignals:feature.FeatureSignals):void {
        // Deactivate the VertexLayer when a the Feature is deselected.
        // This needs to be done *before* the actual selection or we won't be able to deregister the geometry change
        // listener in VertexLayer, causing a memory leak.
        featureSignals.selecting.add((feature:feature.model.FeatureJSON):void => {
            if (!feature) store.current = undefined;
        });
    }

    angular
        .module(MODULE)
        .run(EditorManager);

}
