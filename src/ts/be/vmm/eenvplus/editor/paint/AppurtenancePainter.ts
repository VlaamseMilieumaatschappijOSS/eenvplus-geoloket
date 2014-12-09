///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated
///ts:ref=PainterState
/// <reference path="./PainterState.ts"/> ///ts:ref:generated
///ts:ref=Painter
/// <reference path="./Painter.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.paint.appurtenancePainter {
    'use strict';

    export var NAME:string = PREFIX + 'AppurtenancePainter';

    var controller = _.partial(Painter, feature.FeatureType.APPURTENANCE);
    controller.$inject = ['$scope', '$q', 'epPainterState', 'epFeatureManager'];

    function configure():ng.IDirective {
        return {
            restrict: 'A',
            controller: controller
        };
    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
