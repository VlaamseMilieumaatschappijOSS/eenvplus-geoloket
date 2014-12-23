module be.vmm.eenvplus.editor.geometry {
    'use strict';

    ModifyTool.$inject = ['epMap', 'epGeometryEditorState'];

    export function ModifyTool(map:ol.Map, state:StateController<EditorType>):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var select = _.find(map.getInteractions().getArray(), {
                condition_: ol.events.condition.click
            }),
            modify = new ol.interaction.Modify({
                features: select.getFeatures()
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
