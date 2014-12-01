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

        var vectorLayer, tileLayer, interaction;

        state(FeatureType.SEWER, activate, deactivate);

        function getVectorLayer():ol.layer.Vector {
            return _.find(scope.map.getLayers().getArray(), (layer:ol.layer.Base):boolean => {
                return layer.get('id') === 'all:be.vmm.eenvplus.sdi.model.KoppelPunt';
            });
        }

        function activate():void {
            vectorLayer = getVectorLayer();
            interaction = new ol.interaction.Draw({
                type: 'LineString',
                source: vectorLayer.getSource()//,
                //style: style
            });
            scope.map.addInteraction(interaction);
        }

        function style(feature, resolution):ol.style.Style[] {
            return [];
        }

        function deactivate():void {
            console.log('deactivate sewer');
            scope.map.removeInteraction(interaction);
        }

    }

    angular
        .module(MODULE)
        .directive(NAME, configure);

}
