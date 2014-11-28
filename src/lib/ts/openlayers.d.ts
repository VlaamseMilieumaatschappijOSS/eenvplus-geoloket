declare var ol:ol.Static;

declare module ol {

    interface Static {
        has: {
            DEVICE_PIXEL_RATIO:number;
        }

        events:events.Static;
        geom:geometry.Static;
        interaction:interaction.Static;
        layer:layer.Static;
        render:render.Static;
        source:source.Static;
        style:style.Static;

        Extent:Extent;
        Feature:Feature;
        FeatureOverlay:FeatureOverlay;
        Map:Map;
        Observable:Observable;
        View:View;
    }

    interface Collection<T> extends Object {
        forEach(fn:(value:T, index:number, array:T[]) => void, scope?:any):void;
        getArray():T[];
    }

    interface Coordinate extends Array<number> {
    }

    interface Extent extends Array<number> {
    }

    interface Feature {
        new (config:any):Feature;
    }

    interface FeatureOverlay {
        new (config:any):FeatureOverlay;

        setMap(map:any):void;
        setStyle(style:style.Style):void;
    }

    interface Map extends Object {
        new (config:any):Map;

        addInteraction(interaction:interaction.Interaction):void;
        addLayer(layer:layer.Base):void;
        getLayers():ol.Collection<ol.layer.Base>;
        getPixelFromCoordinate(coordinate:Coordinate):Pixel;
        getSize():Size;
        getView():View;
        render():void;
        removeInteraction(interaction:interaction.Interaction):void;
        removeLayer(layer:layer.Base):void;
    }

    interface Object extends Observable {
    }

    interface ObjectEvent {
    }

    interface Observable {
        prototype:Observable;

        on(type:string, listener:Function, scope?:any):void;
        once(type:string, listener:Function, scope?:any):void;
        un(type:string, listener:Function, scope?:any):void;
    }

    interface Pixel extends Array<number> {
    }

    interface Size extends Array<number> {
    }

    interface View extends Object {
        getResolution():number;
        setResolution(value:number):void;
    }

    module events {

        interface Static {
        }

    }

    module geometry {

        interface Static {
            Polygon:Polygon;
        }

        interface Geometry extends Observable {
            getExtent():Extent;
        }

        interface SimpleGeometry extends Geometry {
        }

        interface Polygon extends SimpleGeometry {
            new (config:any):Polygon;

            getCoordinates():Coordinate[][];
        }

    }

    module interaction {

        interface Static {
            DragBox:DragBox;
        }

        interface DragBox extends Pointer {
            new (config:any):DragBox;

            getGeometry():geometry.Polygon;
        }

        interface Interaction extends Observable {
        }

        interface Pointer extends Interaction {
        }

    }

    module layer {

        interface Static {
            Base:Base;
            Image:Image;
            Layer:Layer;
            Tile:Tile;
            Vector:Vector;
        }

        interface Base extends Object {
            prototype:Base;

            get(key:string):any;
            setVisible(value:boolean):void;
        }

        interface Image extends Layer {
            new (options?:LayerOptions):Image;
        }

        interface Layer extends Base {
            new (options:LayerOptions):Layer;
        }

        interface LayerOptions {
        }

        interface Tile extends Layer {
            new (options?:LayerOptions):Tile;
        }

        interface Vector extends Layer {
            new (options?:LayerOptions):Vector;
        }

    }

    module render {

        interface Static {
            Event:Event;
        }

        interface Event {
            context:CanvasRenderingContext2D;
            frameState:FrameState;
        }

        interface FrameState {
            pixelRatio:number;
        }

    }

    module source {

        interface Static {
            Vector:Vector;
        }

        interface FormatVector extends Vector {
        }

        interface ServerVector extends FormatVector {
        }

        interface Vector {
            new ():Vector;
        }
    }

    module style {

        interface Static {
            Circle:Circle;
            Fill:Fill;
            Stroke:Stroke;
            Style:Style;
        }

        interface Circle {
            new (config:any):Circle;
        }

        interface Fill {
            new (config:any):Fill;
        }

        interface Stroke {
            new (config:any):Stroke;
        }

        interface Style {
            new (config:any):Style;
        }

    }

}
