module be.vmm.eenvplus.editor.geometry {
    'use strict';

    EditorManager.$inject = ['epGeometryEditorStore', 'epFeatureStore'];

    function EditorManager(store:EditorStore, featureStore:feature.FeatureStore):void {
        // Deactivate the VertexLayer when a the Feature is deselected.
        // This needs to be done *before* the actual selection or we won't be able to deregister the geometry change
        // listener in VertexLayer, causing a memory leak.
        featureStore.selecting.add((feature:feature.model.FeatureJSON):void => {
            if (!feature) store.current = undefined;
        });
    }

    angular
        .module(MODULE)
        .run(EditorManager);

}
