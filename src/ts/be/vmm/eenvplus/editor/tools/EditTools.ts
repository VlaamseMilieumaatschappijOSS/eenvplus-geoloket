///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.tools.EditTools {
    'use strict';

    export var NAME:string = PREFIX + 'EditTools';

    function configure():ng.IDirective {
        EditToolsController.$inject = ['epGeometryEditorStore'];

        return {
            restrict: 'A',
            scope: {},
            controllerAs: 'ctrl',
            controller: EditToolsController,
            templateUrl: 'ts/be/vmm/eenvplus/editor/tools/EditTools.html'
        };
    }

    class EditToolsController {

        constructor(store:geometry.EditorStore) {
            this.modify = _.partial(select, geometry.EditorType.MODIFY);
            this.cut = _.partial(select, geometry.EditorType.CUT);

            function select(editor:geometry.EditorType):void {
                store.current = editor === store.current ? undefined : editor;
            }
        }

        public modify:() => void;
        public cut:() => void;

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
