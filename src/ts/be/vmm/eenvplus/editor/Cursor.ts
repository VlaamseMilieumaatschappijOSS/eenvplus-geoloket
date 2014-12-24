///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.cursor {
    'use strict';

    export var NAME:string = PREFIX + 'Cursor';

    directive.$inject = ['epStateStore', 'epAreaStore', 'epPainterStore'];

    function directive(stateStore:state.StateStore, areaStore:area.AreaStore, painterStore:paint.PainterStore):ng.IDirective {

        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        var setCursor:(value:string) => void;

        stateStore.modeChanged.add(handleModeChange);
        areaStore.selected.add(handleAreaSelection);
        painterStore.selected.add(handlePainterSelection);

        return {
            restrict: 'C',
            link: init
        };

        function init(scope:ng.IScope, el:ng.IAugmentedJQuery):void {
            setCursor = function setCursor(value:string):void {
                el.css('cursor', value);
            };
        }


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleModeChange(editMode:state.State):void {
            setCursor(editMode === state.State.EDIT ? 'crosshair' : 'default');
        }

        function handleAreaSelection(extent:ol.Extent):void {
            if (extent) setCursor('default');
        }

        function handlePainterSelection(type:feature.FeatureType):void {
            setCursor(type === undefined ? 'default' : 'crosshair');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, directive);

}
