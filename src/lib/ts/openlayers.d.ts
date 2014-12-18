///ts:ref=closure
/// <reference path="./closure.d.ts"/> ///ts:ref:generated

declare var ol:ol.Static;

declare module ol {

    interface Static {
        has: {
            DEVICE_PIXEL_RATIO:number;
        }

        control:control.Static;
        events:events.Static;
        extent:extent.Static;
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

        CollectionEvent:CollectionEvent<any>;
        CollectionEventType:CollectionEventType;
        CollectionProperty:CollectionProperty;
        DragBoxEvent:DragBoxEvent;
        DragBoxEventType:DragBoxEventType;
        DrawEvent:DrawEvent;
        DrawEventType:DrawEventType;
        Extent:Extent;
        Feature:Feature;
        FeatureOverlay:FeatureOverlay;
        Map:Map;
        ObjectEvent:ObjectEvent;
        Observable:Observable;
        View:View;
        ViewProperty:ViewProperty;
    }

    interface Collection<T> extends Object {
        clear():void;
        extend(array:T[]):Collection<T>;
        forEach(fn:(value:T, index:number, array:T[]) => void, scope?:any):void;
        getArray():T[];
        remove(item:T):T;
    }

    interface CollectionEvent<T> extends goog.events.Event {
        element:T;
    }

    interface CollectionEventType {
        ADD:string;
        REMOVE:string;
    }

    interface CollectionProperty {
        LENGTH:string;
    }

    interface Coordinate extends Array<number> {
    }

    interface DragBoxEvent extends goog.events.Event {
    }

    interface DragBoxEventType {
        /**
         * Triggered upon drag box start.
         */
        BOXSTART:string;
        /**
         * Triggered upon drag box end.
         */
        BOXEND:string;
    }

    interface DrawEvent extends goog.events.Event {
        feature:Feature;
    }

    interface DrawEventType {
        DRAWSTART:string;
        DRAWEND:string;
    }

    interface Extent extends Array<number> {
    }

    interface Feature extends Object {
        new (config:any):Feature;

        getGeometry():geometry.Geometry;
    }

    interface FeatureOverlay {
        new (config:any):FeatureOverlay;

        setMap(map:any):void;
        setStyle(style:style.Style):void;
    }

    interface Map extends Object {
        new (config:MapConfig):Map;

        addControl(control:control.Control):void;
        addInteraction(interaction:interaction.Interaction):void;
        addLayer(layer:layer.Base):void;
        getLayers():ol.Collection<layer.Base>;
        getPixelFromCoordinate(coordinate:Coordinate):Pixel;
        getSize():Size;
        getView():View;
        getViewport():Element;
        render():void;
        removeInteraction(interaction:interaction.Interaction):void;
        removeLayer(layer:layer.Base):void;
    }

    interface MapBrowserEvent extends MapEvent {
    }

    interface MapEvent extends goog.events.Event {
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
        get(key:string):any;
        set(key:string, value:any):any;
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
        new (options?:any):View;

        constrainResolution(resolution:number, delta?:number, direction?:number):number;
        getCenter():ol.Coordinate;
        getResolution():number;
        setCenter(position:ol.Coordinate):void;
        setResolution(value:number):void;
    }

    interface ViewProperty {
        CENTER:string;
        RESOLUTION:string;
        ROTATION:string;
    }

    module control {

        interface Static {
            defaults(options?:any):Collection<Control>;

            Control:Control;
            ZoomToExtent:ZoomToExtent;
        }

        interface Control {
        }

        interface ZoomToExtent extends Control {
            new (options?:any):ZoomToExtent;
        }

    }

    module events {

        interface Static {
            condition:condition.Static;
        }

        module condition {

            interface Static {
                click:interaction.handleMapBrowserEvent;
                mouseMove:interaction.handleMapBrowserEvent;
            }

        }

    }

    module extent {

        interface Static {
            getCenter(extent:Extent):Coordinate;
            intersects(extent1:Extent, extent2:Extent):boolean;
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
            prototype:GeoJSON;

            readFeature(json:GeoJSONFeature, options?:any):Feature;
            readFeatureFromObject(json:GeoJSONFeature, options?:any):Feature;
            readGeometry(source:any, options?:any):geometry.Geometry;
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
            Point:Point;
            Polygon:Polygon;
        }

        interface Geometry extends Observable {
            getExtent():Extent;
        }

        interface GeometryLayout extends String {
        }

        interface SimpleGeometry extends Geometry {
            getFirstCoordinate():Coordinate;
            getLastCoordinate():Coordinate;
        }

        interface Point extends SimpleGeometry {
            new (coordinates:Coordinate, layout?:GeometryLayout):Point;

            getCoordinates():Coordinate;
        }

        interface Polygon extends SimpleGeometry {
            new (config:any):Polygon;

            getCoordinates():Coordinate[][];
        }

    }

    module interaction {

        interface Static {
            defaults(options?:any):Collection<Interaction>;

            DragBox:DragBox;
            DragZoom:DragZoom;
            Draw:Draw;
            DrawMode:DrawMode;
            Select:Select;
        }

        interface DragBox extends Pointer {
            new (config:any):DragBox;

            getGeometry():geometry.Polygon;
        }

        interface DragZoom extends DragBox {
            new (config?:any):DragZoom;
        }

        interface Draw extends Pointer {
            new (config:any):Draw;
        }

        interface DrawMode {
            POINT:string;
            LINE_STRING:string;
            POLYGON:string;
        }

        interface Interaction extends Observable {
            getActive():boolean;
            setActive(value:boolean):void;
        }

        interface Pointer extends Interaction {
        }

        interface Select extends Interaction {
            new (config?:any):Select;
            prototype:Select;

            getFeatures():Collection<Feature>;
            handleMapBrowserEvent:handleMapBrowserEvent;
        }

        interface handleMapBrowserEvent {
            (event:MapBrowserEvent):boolean;
        }

    }

    module layer {

        interface Static {
            Base:Base;
            Image:Image;
            Layer:Layer;
            LayerProperty:LayerProperty;
            Tile:Tile;
            Vector:layer.Vector;
        }

        interface Base extends Object {
            prototype:Base;

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

        interface LayerProperty {
            BRIGHTNESS:string;
            CONTRAST:string;
            HUE:string;
            OPACITY:string;
            SATURATION:string;
            VISIBLE:string;
            MAX_RESOLUTION:string;
            MIN_RESOLUTION:string;
        }

        interface Tile extends Layer {
            new (options?:LayerOptions):Tile;
        }

        interface Vector extends Layer {
            new (options?:LayerOptions):Vector;

            getSource():source.Vector;
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
            get(projection:Projection):Projection;
            get(projection:string):Projection;

            Projection:Projection;
        }

        interface Projection {
            setExtent(extent:Extent):void;
        }
    }

    module render {

        interface Static {
            Event:Event;
            EventType:EventType;
        }

        interface Event {
            context:CanvasRenderingContext2D;
            frameState:FrameState;
        }

        interface EventType {
            POSTCOMPOSE:string;
            PRECOMPOSE:string;
            RENDER:string;
        }

        interface FrameState {
            pixelRatio:number;
        }

    }

    module source {

        interface Static {
            FormatVector:FormatVector;
            ServerVector:ServerVector;
            Vector:source.Vector;
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
            new (options?:VectorConfig):source.Vector;

            addFeature(feature:Feature):void;
            addFeatures(features:Feature[]):void;
            getFeatureById(id:number):Feature;
            getFeatures():Feature[];
            removeFeature(feature:Feature):void;
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
