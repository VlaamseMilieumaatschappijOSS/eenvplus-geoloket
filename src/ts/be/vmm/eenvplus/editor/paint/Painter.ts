module be.vmm.eenvplus.editor.paint {
    'use strict';

    export function Painter(type:feature.FeatureType,
                            scope:ApplicationScope,
                            state:PainterState,
                            service:feature.FeatureService):void {

        var map = scope.map,
            vectorLayer, interaction, unRegisterDrawEnd;

        state(type, activate, deactivate);

        function activate():void {
            vectorLayer = feature.getLayer(map, type);
            interaction = new ol.interaction.Draw({
                type: feature.typeDrawTypeMap[type],
                source: vectorLayer.getSource()//,
                //style: style
            });

            unRegisterDrawEnd = interaction.on(ol.DrawEventType.DRAWEND, commit);
            map.addInteraction(interaction);
        }

        function style(feature, resolution):ol.style.Style[] {
            return [];
        }

        function commit(event:ol.DrawEvent):void {
            service
                .create(vectorLayer.getSource().format.writeFeature(event.feature), type)
                .catch(console.error);
        }

        function deactivate():void {
            unRegisterDrawEnd.src.unByKey(unRegisterDrawEnd);
            map.removeInteraction(interaction);
        }

    }

}
