(function () {
    goog.provide('ga_feature_layer');

    var module = angular.module('ga_feature_layer', ['ga_feature_service']);

    module.factory('gaFeatureLayerFactory', function (gaFeatureManager) {

        return {
            "createSource": function (layerBodId) {

                var source = new ol.source.ServerVector({
                    format: new ol.format.GeoJSON({
                        defaultDataProjection: 'EPSG:31370'
                    }),
                    loader: function (extent, resolution, projection) {
                        gaFeatureManager.query(layerBodId, extent).then(function (results) {
                            source.addFeatures(source.readFeatures({
                                type: 'FeatureCollection',
                                features: results
                            }));
                        });
                    },
                    strategy: ol.loadingstrategy
                        .createTile(new ol.tilegrid.XYZ({
                            maxZoom: 19
                        })),
                    projection: 'EPSG:31370'
                });

                //source.on("addfeature", function (event) {
                //    gaFeatureManager.create(event.feature);
                //});
                //source.on("removefeature", function (event) {
                //    gaFeatureManager.remove(event.feature);
                //});

                return source;
            },

            "createLayer": function (layerBodId) {
                return new ol.layer.Vector({
                    source: this.createSource(layerBodId),
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#FF0000',
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 4,
                            fill: new ol.style.Fill({color: '#880000'}),
                            stroke: new ol.style.Stroke({color: '#ff0000', width: 2})
                        })
                    })
                });
            }
        }
    });
})();
