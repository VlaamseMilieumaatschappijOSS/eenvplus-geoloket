module be.vmm.eenvplus.editor.paint {
    'use strict';

    export function Painter(type:feature.FeatureType,
                            scope:ApplicationScope,
                            state:PainterState,
                            service:feature.FeatureService):void {

        var map = scope.map,
            vectorLayer, mountPointLayer, interaction, unRegisterDrawEnd;

        state(type, activate, deactivate);

        function activate():void {
            vectorLayer = feature.getLayer(map, type);
            mountPointLayer = feature.getLayer(map, feature.FeatureType.MOUNT_POINT);
            interaction = new ol.interaction.Draw({
                type: feature.typeDrawTypeMap[type],
                source: vectorLayer.getSource()//,
                //style: style
            });

            unRegisterDrawEnd = interaction.on(ol.DrawEventType.DRAWEND, finalizeOperation);
            map.addInteraction(interaction);
        }

        function style(feature, resolution):ol.style.Style[] {
            return [];
        }

        function finalizeOperation(event:ol.DrawEvent):void {
            var geometry = <ol.geometry.SimpleGeometry> event.feature.getGeometry(),
                first = geometry.getFirstCoordinate(),
                last = geometry.getLastCoordinate(),
                mountPoints = [createPoint(last)];

            if (!_.isEqual(first, last)) mountPoints.push(createPoint(first));

            mountPointLayer
                .getSource()
                .addFeatures(mountPoints);
            mountPoints
                .concat([event.feature])
                .forEach(commit);
        }

        function createPoint(coordinates:ol.Coordinate):ol.Feature {
            return new ol.Feature({
                geometry: new ol.geom.Point(coordinates)
            });
        }

        function commit(feature:ol.Feature):void {
            var json = vectorLayer.getSource().format.writeFeature(feature);
            service
                .create(json, type)
                .catch(console.error);
        }

        function deactivate():void {
            unRegisterDrawEnd.src.unByKey(unRegisterDrawEnd);
            map.removeInteraction(interaction);
        }

    }

}
