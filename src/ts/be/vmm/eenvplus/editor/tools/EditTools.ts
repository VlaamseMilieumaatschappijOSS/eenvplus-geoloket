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
            this.split = _.partial(select, geometry.EditorType.SPLIT);
            this.merge = _.partial(select, geometry.EditorType.MERGE);
            this.modifySelected = _.partial(isSelected, geometry.EditorType.MODIFY);
            this.splitSelected = _.partial(isSelected, geometry.EditorType.SPLIT);
            this.mergeSelected = _.partial(isSelected, geometry.EditorType.MERGE);

            function select(editor:geometry.EditorType):void {
                if (editor === geometry.EditorType.MODIFY)
                    store.current = isSelected(editor) ? undefined : editor;
                else alert('Feature to be implemented!');
            }

            function isSelected(editor:geometry.EditorType):boolean {
                return store.current === editor;
            }
        }

        public modify:() => void;
        public split:() => void;
        public merge:() => void;

        public modifySelected:() => boolean;
        public splitSelected:() => boolean;
        public mergeSelected:() => boolean;

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
