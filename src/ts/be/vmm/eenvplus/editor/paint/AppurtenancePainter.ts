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

        var vectorLayer, tileLayer, interaction;

        state(FeatureType.APPURTENANCE, activate, deactivate);

        function getVectorLayer():ol.layer.Vector {
            return _.find(scope.map.getLayers().getArray(), (layer:ol.layer.Base):boolean => {
                return layer.get('id') === 'be.vmm.eenvplus.sdi.model.KoppelPunt';
            });
        }

        function activate():void {
            vectorLayer = getVectorLayer();
            interaction = new ol.interaction.Draw({
                type: 'Point',
                source: vectorLayer.getSource()//,
                //style: style
            });
            scope.map.addInteraction(interaction);
        }

        function style(feature, resolution):ol.style.Style[] {
            return [];
        }

        function deactivate():void {
            console.log('deactivate appurtenance');
            scope.map.removeInteraction(interaction);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
