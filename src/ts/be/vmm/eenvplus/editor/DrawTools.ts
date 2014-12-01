///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.drawTools {
    'use strict';

    export var NAME:string = PREFIX + 'DrawTools';

    interface Scope extends ng.IScope {
        selectedItem:Module.Painter;
        requestEditMode:() => void;
        requestSewerPainter:() => void;
        requestAppurtenancePainter:() => void;
    }

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            scope: {},
            controller: DrawToolsController,
            templateUrl: 'html/be/vmm/eenvplus/editor/DrawTools.html'
        };
    }

    DrawToolsController.$inject = ['$scope', '$rootScope'];

    function DrawToolsController(scope:Scope, rootScope:ng.IScope) {

        _.merge(scope, {
            requestEditMode: requestEditMode,
            requestSewerPainter: _.partial(requestPainter, Module.Painter.SEWER),
            requestAppurtenancePainter: _.partial(requestPainter, Module.Painter.APPURTENANCE)
        });

        function requestEditMode():void {
            rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.EDIT);
        }

        function requestPainter(painter:Module.Painter):void {
            scope.selectedItem = scope.selectedItem === painter ? undefined : painter;

        }

    }

    angular
        .module(Module.EDITOR)
        .directive(NAME, configure);

}
