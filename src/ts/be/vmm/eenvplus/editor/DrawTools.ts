///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.drawTools {
    'use strict';

    export var NAME:string = PREFIX + 'DrawTools';

    interface Scope extends ng.IScope {
        selectedItem:feature.FeatureType;
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
            selectSewerPainter: _.partial(selectPainter, feature.FeatureType.SEWER),
            selectAppurtenancePainter: _.partial(selectPainter, feature.FeatureType.APPURTENANCE)
        });

        scope.$on(feature.EVENT.selected, _.partial(selectPainter, undefined));

        function requestEditMode():void {
            rootScope.$broadcast(applicationState.EVENT.modeRequest, applicationState.State.EDIT);
        }

        function selectPainter(painter:feature.FeatureType):void {
            scope.selectedItem = scope.selectedItem === painter ? undefined : painter;
            rootScope.$broadcast(paint.EVENT.selected, scope.selectedItem);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
