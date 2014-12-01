///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated
///ts:ref=PainterState
/// <reference path="./PainterState.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.paint.sewerPainter {
    'use strict';

    export var NAME:string = PREFIX + 'SewerPainter';

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            controller: SewerPainterController
        };
    }

    SewerPainterController.$inject = ['$scope', 'epPainterState'];

    function SewerPainterController(scope:ApplicationScope, state:PainterState):void {

        state(FeatureType.SEWER, activate, deactivate);

        function activate():void {
            console.log('activate sewer');
        }

        function deactivate():void {
            console.log('deactivate sewer');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
