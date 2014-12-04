module be.vmm.eenvplus.editor.paint {
    'use strict';

    export function Painter(type:feature.FeatureType,
                            scope:ApplicationScope,
                            state:PainterState,
                            service:feature.FeatureService,
                            q:ng.IQService):void {

        var map = scope.map,
            commitFeature = commitFn(type),
            commitMountPoint = commitFn(feature.FeatureType.MOUNT_POINT),
            vectorLayer, mountPointLayer, interaction, unRegisterDrawEnd;

        state(type, activate, deactivate);

        function activate():void {
            vectorLayer = feature.getLayer(map, type);
            mountPointLayer = feature.getLayer(map, feature.FeatureType.MOUNT_POINT);
            interaction = new ol.interaction.Draw({
                type: feature.typeDrawModeMap[type],
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
            mountPoints.forEach(commitMountPoint);

            commitFeature(event.feature)
                .then((feature:feature.model.FeatureJSON):void => {
                    scope.$broadcast('featuresSelected', [feature]);
                });
        }

        function createPoint(coordinates:ol.Coordinate):ol.Feature {
            return new ol.Feature({
                geometry: new ol.geom.Point(coordinates)
            });
        }

        function commit(feature:feature.model.FeatureJSON):ng.IPromise<feature.model.FeatureJSON> {
            var deferred = q.defer<feature.model.FeatureJSON>();

            service
                .create(feature)
                .then(getSavedData)
                .catch(console.error);

            return deferred.promise;

            function getSavedData(key:number):void {
                service
                    .get(feature.layerBodId, key)
                    .then(deferred.resolve)
                    .catch(console.error);
            }
        }

        function commitFn(type:feature.FeatureType):(feature:ol.Feature) => ng.IPromise<feature.model.FeatureJSON> {
            return _.compose(commit, _.partial(toJson, type));
        }

        function toJson(type:feature.FeatureType, newFeature:ol.Feature):feature.model.FeatureJSON {
            var json = <feature.model.FeatureJSON>vectorLayer.getSource().format.writeFeature(newFeature);
            json.layerBodId = feature.toLayerBodId(type);
            return json;
        }

        function deactivate():void {
            unRegisterDrawEnd.src.unByKey(unRegisterDrawEnd);
            map.removeInteraction(interaction);
        }

    }

}
