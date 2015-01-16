module be.vmm.eenvplus.editor.snapping {
    'use strict';

    export interface DrawPrivate extends ol.interaction.Draw {
        sketchFeature_:ol.Feature;
        sketchLine_:ol.Feature;
        sketchPoint_:ol.Feature;
        snapTolerance_:number;

        abortDrawing_():ol.Feature;
        addToDrawing_(event:ol.MapBrowserPointerEvent):void;
        createOrUpdateSketchPoint_(event:ol.MapBrowserPointerEvent):void;
        /** OL 3.1.0 / became public in 3.1.1 */
        finishDrawing_():void;
        handlePointerMove_(event:ol.MapBrowserPointerEvent):void;
        modifyDrawing_(event:ol.MapBrowserPointerEvent):void;
        startDrawing_(event:ol.MapBrowserPointerEvent):void;
        updateSketchFeatures_():void;
    }

}
