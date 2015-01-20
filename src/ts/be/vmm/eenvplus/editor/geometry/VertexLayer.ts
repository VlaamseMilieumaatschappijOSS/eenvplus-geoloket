///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.geometry {
    'use strict';

    VertexLayerController.$inject = ['epMap', 'epGeometryEditorState', 'epFeatureStore'];

    export function VertexLayerController(map:ol.Map,
                                          state:StateController<EditorType>,
                                          featureStore:feature.FeatureStore):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var layer = new ol.FeatureOverlay(),
            vertices = new ol.geom.MultiPoint([]);


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        layer.getFeatures().push(new ol.Feature({
            geometry: vertices
        }));
        state(EditorType.MODIFY, activate, deactivate, canActivate);


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function canActivate():boolean {
            return feature.isType(feature.FeatureType.SEWER, featureStore.current.layerBodId);
        }

        function activate():void {
            layer.setMap(map);

            featureStore.selected.add(updateGeometry);
            getGeometry().on(goog.events.EventType.CHANGE, updateGeometry);

            updateGeometry();
        }

        function getGeometry():ol.geometry.Geometry {
            return featureStore.selectedView ? featureStore.selectedView.getGeometry() : undefined;
        }

        function updateGeometry():void {
            var geometry = <ol.geometry.LineString> getGeometry();
            if (geometry) vertices.setCoordinates(geometry.getCoordinates());
        }

        function deactivate():void {
            layer.setMap(null);

            featureStore.selected.remove(updateGeometry);
            getGeometry().un(goog.events.EventType.CHANGE, updateGeometry);
        }

    }

    angular
        .module(MODULE)
        .run(VertexLayerController);

}
