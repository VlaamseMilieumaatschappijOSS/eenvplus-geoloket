module be.vmm.eenvplus.editor.snapping {
    'use strict';

    export interface DrawPrivate extends ol.interaction.Draw {
        sketchFeature_:ol.Feature;
        sketchLine_:ol.Feature;
        sketchPoint_:ol.Feature;
        snapTolerance_:number;

        abortDrawing_():ol.Feature;
        addToDrawing_(event:ol.MapBrowserEvent):void;
        createOrUpdateSketchPoint_(event:ol.MapBrowserEvent):void;
        /** OL 3.0.0 / became public in 3.1.1 */
        finishDrawing_():void;
        handlePointerMove_(event:ol.MapBrowserEvent):void;
        modifyDrawing_(event:ol.MapBrowserEvent):void;
        updateSketchFeatures_():void;
    }

}
