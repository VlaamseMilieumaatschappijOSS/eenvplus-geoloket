module be.vmm.eenvplus.editor.geometry {
    'use strict';

    ModifyTool.$inject = ['epMap', 'epGeometryEditorState', 'epFeatureStore'];

    export function ModifyTool(map:ol.Map, state:StateController<EditorType>, featureStore:feature.FeatureStore):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var modify = new ol.interaction.Modify({
            features: featureStore.selection
        });


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        state(EditorType.MODIFY, activate, deactivate);


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate():void {
            map.addInteraction(modify);
        }

        function deactivate():void {
            map.removeInteraction(modify);
        }

    }

    angular
        .module(MODULE)
        .run(ModifyTool);

}
