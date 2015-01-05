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
        featureStore.selected.add(handleFeatureSelection);


        /* ---------------------- */
        /* --- event handlers --- */
        /* ---------------------- */

        function handleEditorSelection(editor:EditorType):void {
            editor === undefined ? deactivate() : activate();
        }

        function handleFeatureSelection(feature:feature.model.FeatureJSON):void {
            if (feature === undefined) deactivate();
            else updateGeometry();
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate() {
            if (active) return;

            active = true;
            layer.setMap(map);
            featureStore.geometry.on(goog.events.EventType.CHANGE, updateGeometry);
        }

        function updateGeometry():void {
            var geometry = <ol.geometry.LineString> featureStore.geometry;
            vertices.setCoordinates(geometry.getCoordinates());
        }

        function deactivate() {
            if (!active) return;

            active = false;
            layer.setMap(null);
            featureStore.geometry.un(goog.events.EventType.CHANGE, updateGeometry);
        }

    }

    angular
        .module(MODULE)
        .run(VertexLayerController);

}
