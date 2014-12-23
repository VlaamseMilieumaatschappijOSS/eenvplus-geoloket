module be.vmm.eenvplus.editor.geometry {
    'use strict';

    MoveTool.$inject = ['epMap', 'epGeometryEditorState'];

    export function MoveTool(map:ol.Map, state:StateController<EditorType>):void {

        state(EditorType.MOVE, activate, deactivate);

        function activate():void {

        }

        function deactivate():void {

        }

    }

    angular
        .module(MODULE)
        .run(MoveTool);

}
