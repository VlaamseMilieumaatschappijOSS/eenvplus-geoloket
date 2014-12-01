///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.drawTools {
    'use strict';

    export var NAME:string = PREFIX + 'DrawTools';

    interface Scope extends ng.IScope {
        selectedItem:paint.FeatureType;
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
            selectSewerPainter: _.partial(selectPainter, paint.FeatureType.SEWER),
            selectAppurtenancePainter: _.partial(selectPainter, paint.FeatureType.APPURTENANCE)
        });

        function requestEditMode():void {
            rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.EDIT);
        }

        function selectPainter(painter:paint.FeatureType):void {
            scope.selectedItem = scope.selectedItem === painter ? undefined : painter;
            rootScope.$broadcast(paint.EVENT.selected, scope.selectedItem);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
