///ts:ref=closure
/// <reference path="./closure.d.ts"/> ///ts:ref:generated

declare var ol:ol.Static;

declare module ol {

    interface Static {
        has: {
            DEVICE_PIXEL_RATIO:number;
        }

        control:control.Static;
        coordinate:coordinate.Static;
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
        struct:struct.Static;
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
        getLength():number;
        item(index:number):T;
        push(item:T):number;
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
        new (config?:any):FeatureOverlay;

        getFeatures():Collection<Feature>;
        setMap(map:any):void;
        setStyle(style:style.Style):void;
    }

    interface Map extends Object {
        new (config:MapConfig):Map;

        addControl(control:control.Control):void;
        addInteraction(interaction:interaction.Interaction):void;
        addLayer(layer:layer.Base):void;
        getCoordinateFromPixel(pixel:Pixel):Coordinate;
        getEventCoordinate(event:MouseEvent):Coordinate;
        getEventPixel(event:MouseEvent):Pixel;
        getInteractions():Collection<ol.interaction.Interaction>;
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
        browserEvent:goog.events.BrowserEvent;
        originalEvent:Event;
        pixel:ol.Pixel;
        type:string;
    }

    interface MapEvent extends goog.events.Event {
        map:ol.Map;
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
        changed():void;
        get(key:string):any;
        getProperties<T>():T;
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

    interface Overlay extends Object {
        removeFeature(feature:ol.Feature):void;
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

    module coordinate {

        interface Static {
            closestOnSegment(coordinate:Coordinate, segment:Coordinate[]):Coordinate;
            equals(coordinateA:Coordinate, coordinateB:Coordinate):boolean;
            squaredDistance(coordinateA:Coordinate, coordinateB:Coordinate):number;
            squaredDistanceToSegment(coordinate:Coordinate, segment:Coordinate[]):number;
        }

    }

    module events {

        interface Static {
            condition:condition.Static;
        }

        module condition {

            interface Static {
                altKeyOnly:interaction.handleMapBrowserEvent;
                click:interaction.handleMapBrowserEvent;
                mouseMove:interaction.handleMapBrowserEvent;
                noModifierKeys:interaction.handleMapBrowserEvent;
                singleClick:interaction.handleMapBrowserEvent;
            }

        }

    }

    module extent {

        interface Static {
            boundingExtent(coordinates:Coordinate[]):Extent;
            containsCoordinate(extent:Extent, coordinate:Coordinate):boolean;
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
                coordinates:any; //Coordinate|Coordinate[];
                type:string;
            };
            type:string;
        }

        interface JSONFeature extends Feature {
        }

    }

    module geometry {

        interface Static {
            MultiPoint:MultiPoint;
            Point:Point;
            Polygon:Polygon;
        }

        interface Geometry extends Observable {
            getExtent():Extent;
        }

        interface GeometryLayout extends String {
        }

        interface LineString extends SimpleGeometry {
            new (coordinates:Coordinate[], layout?:GeometryLayout):LineString;

            getCoordinates():Coordinate[];
        }

        interface MultiPoint extends SimpleGeometry {
            new (coordinates:Coordinate[], layout?:GeometryLayout):MultiPoint;

            getCoordinates():Coordinate[];
            setCoordinates(coordinates:Coordinate[]):void;
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
            Modify:Modify;
            SegmentDataType:SegmentDataType;
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
            handleEvent(event:MapBrowserEvent):boolean;
            handleMapBrowserEvent(event:MapBrowserEvent):boolean;
            setActive(value:boolean):void;
        }

        interface Modify extends Pointer {
            new (config:any):Modify;
        }

        interface Pointer extends Interaction {
        }

        interface SegmentDataType {
            depth:number[];
            feature:ol.Feature;
            geometry:ol.geometry.SimpleGeometry;
            index:number;
            segment:ol.Coordinate[];
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
            Tile:Tile<source.Tile>;
            Vector:layer.Vector;
        }

        interface Base extends Object {
            prototype:Base;

            setVisible(value:boolean):void;
        }

        interface Image extends Layer {
            prototype:Image;

            new (options?:LayerOptions):Image;
        }

        interface Layer extends Base {
            prototype:Layer;

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

        interface Tile<T extends source.Tile> extends Layer {
            prototype:Tile<T>;

            new (options?:LayerOptions):Tile<T>;

            getSource():T;
        }

        interface Vector extends Layer {
            prototype:Vector;

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

        interface Image extends Source, ImageConfig {
        }

        interface ImageConfig {
        }

        interface ServerVector extends FormatVector {
            new (options?:VectorConfig):ServerVector;

            readFeatures(query:FeatureQuery):Feature[];
        }

        interface Source extends Observable {
            clear():void;
        }

        interface Tile extends Source {
        }

        interface TileWMS extends Tile, TileWMSConfig {
            getUrls():string[];
            setUrl(url:string);
            setUrls(urls:string[]);
        }

        interface TileWMSConfig {
            url:string;
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

    module struct {

        interface Static {
            RBush:RBush<any>;
        }

        interface RBush<T> {
            getInExtent(extent:Extent):T[];
        }

    }

    module style {

        interface Static {
            Circle:Circle;
            Fill:Fill;
            Icon:Icon;
            Stroke:Stroke;
            Style:Style;
        }

        interface Circle {
            new (config:any):Circle;
        }

        interface Fill {
            new (config:any):Fill;
        }

        interface Icon {
            new (config:any):Icon;
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
