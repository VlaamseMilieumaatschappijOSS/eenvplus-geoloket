///ts:ref=closure
/// <reference path="./closure.d.ts"/> ///ts:ref:generated

declare var ol:ol.Static;

declare module ol {

    interface Static {
        has: {
            DEVICE_PIXEL_RATIO:number;
        }

        control:control.Static;
        format:format.Static;
        geom:geometry.Static;
        interaction:interaction.Static;
        layer:layer.Static;
        loadingstrategy:loadingstrategy.Static;
        proj:proj.Static;
        render:render.Static;
        source:source.Static;
        style:style.Static;
        tilegrid:tilegrid.Static;

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

    interface DrawEvent extends goog.events.Event {
        feature:Feature;
    }

    interface Extent extends Array<number> {
    }

    interface Feature extends Object {
        new (config:any):Feature;
    }

    interface FeatureOverlay {
        new (config:any):FeatureOverlay;

        setMap(map:any):void;
        setStyle(style:style.Style):void;
    }

    interface Map extends Object {
        new (config:MapConfig):Map;

        addInteraction(interaction:interaction.Interaction):void;
        addLayer(layer:layer.Base):void;
        getLayers():ol.Collection<layer.Base>;
        getPixelFromCoordinate(coordinate:Coordinate):Pixel;
        getSize():Size;
        getView():View;
        render():void;
        removeInteraction(interaction:interaction.Interaction):void;
        removeLayer(layer:layer.Base):void;
    }

    interface MapConfig {
        //controls:Collection<control.Control>;
        //controls:control.Control[];
        //interactions:Collection<interaction.Interaction>;
        //interactions:interaction.Interaction[];
        //layers:Collection<layer.Base>;
        //layers:layer.Base[];
        //logo:any;
        //overlays:Collection<Overlay>;
        //overlays:Overlay[];
        //renderer:string;
        //renderer:RendererType;
        //renderer:string[];
        //renderer:RendererType[];
        //target:Element;
        //target:string;
        //view:View;
    }

    interface Object extends Observable {
    }

    interface ObjectEvent extends goog.events.Event {
    }

    interface Observable {
        prototype:Observable;

        on(type:string, listener:Function, scope?:any):goog.events.Key<Observable>;
        once(type:string, listener:Function, scope?:any):goog.events.Key<Observable>;
        un(type:string, listener:Function, scope?:any):void;
        unByKey(key:goog.events.Key<Observable>):void;
    }

    interface Overlay {
    }

    interface Pixel extends Array<number> {
    }

    interface RendererType {
    }

    interface Size extends Array<number> {
    }

    interface View extends Object {
        getCenter():ol.Coordinate;
        getResolution():number;
        setCenter(position:ol.Coordinate):void;
        setResolution(value:number):void;
    }

    module control {

        interface Static {
            Control:Control;
        }

        interface Control {
        }

    }

    module format {

        interface Static {
            GeoJSON:GeoJSON;
        }

        interface Feature {
        }

        interface GeoJSON extends JSONFeature {
            new (config?:GEOJSONConfig):GeoJSON;

            readFeature(json:GeoJSONFeature, option?:any):Feature;
            writeFeature(feature:Feature, options?:any):GeoJSONFeature;
        }

        interface GEOJSONConfig {
            //defaultDataProjection:string;
            //defaultDataProjection:ol.proj.Projection;
            //geometryName:string;
        }

        interface GeoJSONFeature {
            geometry:{
                coordinates:Coordinate[];
                type:string;
            };
            type:string;
        }

        interface JSONFeature extends Feature {
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
            Draw:Draw;
        }

        interface DragBox extends Pointer {
            new (config:any):DragBox;

            getGeometry():geometry.Polygon;
        }

        interface Draw extends Pointer {
            new (config:any):Draw;
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
            set(key:string, value:any):any;
            setVisible(value:boolean):void;
        }

        interface Image extends Layer {
            new (options?:LayerOptions):Image;
        }

        interface Layer extends Base {
            new (options:LayerOptions):Layer;

            getSource():source.Source;
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

    module loadingstrategy {

        interface Static {
            createTile:createTile;
        }

        interface createTile {
            (tileGrid:ol.tilegrid.TileGrid):createTile;
        }

    }

    module proj {

        interface Static {
            Projection:Projection;
        }

        interface Projection {
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
            FormatVector:FormatVector;
            ServerVector:ServerVector;
            Vector:Vector;
        }

        interface FeatureQuery {
        }

        interface FormatVector extends Vector {
            new (options?:VectorConfig):FormatVector;
        }

        interface ServerVector extends FormatVector {
            new (options?:VectorConfig):ServerVector;

            readFeatures(query:FeatureQuery):Feature[];
        }

        interface Source extends Observable {
            clear():void;
        }

        interface Vector extends Source, VectorConfig {
            new (options?:VectorConfig):Vector;

            addFeatures(features:Feature[]):void;
        }

        interface VectorConfig {
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

    module tilegrid {

        interface Static {
            XYZ:XYZ;
        }

        interface TileGrid {
            new (config:TileGridConfig):TileGrid;
        }

        interface TileGridConfig {
        }

        interface XYZ extends TileGrid {
            new (config:TileGridConfig):XYZ;
        }

    }

}
