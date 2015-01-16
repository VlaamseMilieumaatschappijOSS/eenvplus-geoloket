///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.geometry {
    'use strict';

    VertexLayerController.$inject = ['epMap', 'epGeometryEditorStore', 'epFeatureStore'];

    export function VertexLayerController(map:ol.Map, editorStore:EditorStore, featureStore:feature.FeatureStore):void {

        /* ------------------ */
        /* --- properties --- */
        /* ------------------ */

        var layer = new ol.FeatureOverlay(),
            vertices = new ol.geom.MultiPoint([]),
            active = false;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

        layer.getFeatures().push(new ol.Feature({
            geometry: vertices
        }));
        editorStore.selected.add(handleEditorSelection);


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleEditorSelection(editor:EditorType):void {
            editor === undefined ? deactivate() : activate();
        }

        /**
         * Deactivate the VertexLayer when a the Feature is deselected.
         * This needs to be done *before* the actual selection or we won't be able to deregister the geometry change
         * listener, causing a memory leak.
         *
         * @param feature
         */
        function handleFeatureBeforeSelection(feature:feature.model.FeatureJSON):void {
            if (feature === undefined) deactivate();
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate() {
            if (active) return;

            active = true;
            layer.setMap(map);

            featureStore.selecting.add(handleFeatureBeforeSelection);
            featureStore.selected.add(updateGeometry);
            getGeometry().on(goog.events.EventType.CHANGE, updateGeometry);
        }

        function getGeometry():ol.geometry.Geometry {
            return featureStore.selectedView ? featureStore.selectedView.getGeometry() : undefined;
        }

        function updateGeometry():void {
            var geometry = <ol.geometry.LineString> getGeometry();
            if (geometry) vertices.setCoordinates(geometry.getCoordinates());
        }

        function deactivate() {
            if (!active) return;

            active = false;
            layer.setMap(null);

            featureStore.selecting.remove(handleFeatureBeforeSelection);
            featureStore.selected.remove(updateGeometry);
            getGeometry().un(goog.events.EventType.CHANGE, updateGeometry);
        }

    }

    angular
        .module(MODULE)
        .run(VertexLayerController);

}
