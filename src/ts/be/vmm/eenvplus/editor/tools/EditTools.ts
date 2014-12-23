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
            this.move = _.partial(select, geometry.EditorType.MOVE);
            this.cut = _.partial(select, geometry.EditorType.CUT);
            this.add = _.partial(select, geometry.EditorType.ADD);
            this.remove = _.partial(select, geometry.EditorType.REMOVE);

            function select(editor:geometry.EditorType):void {
                store.current = editor;
            }
        }

        public move:() => void;
        public cut:() => void;
        public add:() => void;
        public remove:() => void;

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
