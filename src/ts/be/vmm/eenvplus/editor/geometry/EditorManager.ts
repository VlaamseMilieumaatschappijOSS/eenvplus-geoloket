module be.vmm.eenvplus.editor.geometry {
    'use strict';

    EditorManager.$inject = ['epGeometryEditorStore', 'epFeatureStore'];

    function EditorManager(store:EditorStore, featureStore:feature.FeatureStore):void {
        featureStore.selected.add((feature:feature.model.FeatureJSON):void => {
            if (!feature) store.current = undefined;
        });
    }

    angular
        .module(MODULE)
        .run(EditorManager);

}
