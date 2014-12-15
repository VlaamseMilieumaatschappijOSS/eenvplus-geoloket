module be.vmm.eenvplus.editor.paint {
    'use strict';

    export function Painter(type:feature.FeatureType,
                            scope:ApplicationScope,
                            q:ng.IQService,
                            state:PainterState,
                            manager:feature.FeatureManager):void {

        var map = scope.map,
            commitFeature = commitFn(type),
            commitNode = commitFn(feature.FeatureType.NODE),
            vectorLayer, nodeLayer, interaction, unRegisterDrawEnd;

        state(type, activate, deactivate);

        function activate():void {
            vectorLayer = feature.getLayer(map, type);
            nodeLayer = feature.getLayer(map, feature.FeatureType.NODE);
            interaction = new ol.interaction.Draw({
                type: feature.typeDrawModeMap[type],
                source: vectorLayer.getSource()
            });

            unRegisterDrawEnd = interaction.on(ol.DrawEventType.DRAWEND, finalizeOperation);
            map.addInteraction(interaction);
        }

        function finalizeOperation(event:ol.DrawEvent):void {
            var newFeature = <feature.LocalFeature> event.feature,
                geometry = <ol.geometry.SimpleGeometry> newFeature.getGeometry(),
                first = geometry.getFirstCoordinate(),
                last = geometry.getLastCoordinate(),
                nodes = [createNode(last)],
                promises;

            newFeature.type = type;

            if (!_.isEqual(first, last)) nodes.push(createNode(first));

            nodeLayer
                .getSource()
                .addFeatures(nodes);
            promises = nodes.map(commitNode);
            promises.push(commitFeature(newFeature));

            // set keys returned from DB on their respective Features
            _.zip(promises, nodes.concat([newFeature]))
                .forEach(apply(setKey));

            q.all(promises)
                .then(linkFeatures)
                .then(notifySelection);

            function linkFeatures(jsons:feature.model.FeatureJSON[]):feature.model.FeatureJSON {
                var featureJson = _.find(jsons, {layerBodId: feature.toLayerBodId(type)}),
                    nodeJsons = _.difference(jsons, [featureJson]);

                if (!_.isEqual(nodeJsons[0].geometry.coordinates, first))
                    nodeJsons.reverse();
                manager.link(featureJson, nodeJsons);

                return featureJson;
            }
        }

        function createNode(coordinates:ol.Coordinate):feature.LocalFeature {
            return _.merge(new ol.Feature({
                geometry: new ol.geom.Point(coordinates)
            }), {type: feature.FeatureType.NODE});
        }

        function notifySelection(json:feature.model.FeatureJSON):void {
            scope.$broadcast(feature.EVENT.selected, [json]);
        }

        function commitFn(type:feature.FeatureType):(feature:ol.Feature) => ng.IPromise<feature.model.FeatureJSON> {
            return _.compose(manager.create, _.partial(toJson, type));
        }

        function setKey(promise:ng.IPromise<feature.model.FeatureJSON>, feature:feature.LocalFeature):void {
            promise.then((json:feature.model.FeatureJSON):void => {
                feature.key = json.key;
            });
        }

        function toJson(type:feature.FeatureType, newFeature:ol.Feature):feature.model.FeatureJSON {
            var json = <feature.model.FeatureJSON> vectorLayer.getSource().format.writeFeature(newFeature);
            json.layerBodId = feature.toLayerBodId(type);
            return json;
        }

        function deactivate():void {
            unRegisterDrawEnd.src.unByKey(unRegisterDrawEnd);
            map.removeInteraction(interaction);
        }

    }

}
