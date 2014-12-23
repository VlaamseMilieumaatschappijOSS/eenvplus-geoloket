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
            features = layer.getFeatures(),
            active = false;


        /* -------------------- */
        /* --- construction --- */
        /* -------------------- */

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
        }


        /* ----------------- */
        /* --- behaviour --- */
        /* ----------------- */

        function activate() {
            if (active) return;

            active = true;
            featureStore.current.geometry.coordinates
                .forEach(createVertex);
            layer.setMap(map);
        }

        function createVertex(coordinate:ol.Coordinate):void {
            features.push(new ol.Feature({
                geometry: new ol.geom.Point(coordinate)
            }));
        }

        function deactivate() {
            if (!active) return;

            active = false;
            layer.setMap(null);
        }

    }

    angular
        .module(MODULE)
        .run(VertexLayerController);

}
