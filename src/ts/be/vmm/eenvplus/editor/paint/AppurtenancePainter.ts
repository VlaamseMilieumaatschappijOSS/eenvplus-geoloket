///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated
///ts:ref=PainterState
/// <reference path="./PainterState.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.paint.appurtenancePainter {
    'use strict';

    export var NAME:string = PREFIX + 'AppurtenancePainter';

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            controller: AppurtenanceController
        };
    }

    AppurtenanceController.$inject = ['$scope', 'epPainterState'];

    function AppurtenanceController(scope:ApplicationScope, state:PainterState):void {

        state(FeatureType.APPURTENANCE, activate, deactivate);

        function activate():void {
            console.log('activate appurtenance');
        }

        function deactivate():void {
            console.log('deactivate appurtenance');
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
