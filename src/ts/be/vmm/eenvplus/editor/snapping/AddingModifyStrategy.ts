///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    AddingModifyStrategy.$inject = ['epMap', 'epSnappingState', 'epSnappingMonitor'];

    function AddingModifyStrategy(map:ol.Map,
                                  state:StateController<SnappingType>,
                                  monitor:SnappingMonitor):void {

        var modify:geometry.ModifyPrivate,
            moddedFeature:ol.Feature,
            updateMonitor,
            stopDragging,
            superPointerDrag,
            superPointerUp;

        /**
         * @returns A type-safe instance of the sketch feature's Geometry.
         */
        function getGeometry():ol.geometry.SimpleGeometry {
            return moddedFeature ? <ol.geometry.SimpleGeometry> moddedFeature.getGeometry() : undefined;
        }

        state(SnappingType.ADD, activate, deactivate, canActivate);

        function canActivate():boolean {
            modify = _.find(map.getInteractions().getArray(), isActiveModify);
            return !!modify;
        }

        function isActiveModify(interaction:ol.interaction.Interaction):boolean {
            return interaction instanceof ol.interaction.Modify && interaction.getActive();
        }

        function activate():void {
            moddedFeature = modify.features_.item(0);

            var proto = <geometry.ModifyPrivate> ol.interaction.Modify.prototype;
            superPointerDrag = proto.handlePointerDrag.bind(modify);
            superPointerUp = proto.handlePointerUp.bind(modify);

            var atStart = _.compose(atIndex, _.constant(0)),
                atEnd = _.compose(atIndex, () => {
                    return numVertices() - 1;
                });
            modify.handlePointerDrag = updateMonitor = _.partialRight(monitor.update, atStart, atEnd);
            modify.handlePointerUp = stopDragging = _.compose(monitor.reset, superPointerUp);

            monitor.reset();
            monitor.moveAtEnd.add(superPointerDrag);
            monitor.moveAtStart.add(superPointerDrag);
            monitor.moveOutside.add(superPointerDrag);
            monitor.snapInEnd.add(snapToEnd);
            monitor.snapInStart.add(snapToStart);
            monitor.snapOutEnd.add(unsnapEnd);
            monitor.snapOutStart.add(unsnapStart);
        }

        function atIndex(index:number):boolean {
            if (modify.dragSegments_.length !== 1) return false;

            var dragSegment = modify.dragSegments_[0],
                dragIndex = dragSegment[0].index + dragSegment[1];

            return dragIndex === index;
        }

        /**
         * Place the dragged starting vertex at the snapping coordinate,
         * then insert a new vertex on the start segment and put it at the mouse Coordinate.
         *
         * Note: because `insertVertex()` will push the two newly created segments into `dragSegments_`,
         * we need to remove the old one (i.e. the first one in the stack).
         *
         * @param event
         * @see Modify#handlePointerDrag
         * @see Modify#insertVertex_
         */
        function snapToStart(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            superPointerDrag(event);

            modify.insertVertex_(getStartSegment(), event.mouseCoordinate);
            modify.dragSegments_.shift();

            //_.each(modify.rBush_.getAll(), (segment:ol.interaction.SegmentDataType) => {
            //    console.log(segment.index);
            //});
            //_.each(modify.dragSegments_, (segment:any[]) => {
            //    console.log(segment[0].index, segment[1]);
            //});
        }

        function unsnapStart(event:SnappingPointerEvent):void {
            modify.removeVertex_();
            modify.dragSegments_.pop();
            modify.dragSegments_[0][0] = getStartSegment();
            modify.dragSegments_[0][1] = 0;
            superPointerDrag(event);
        }

        function snapToEnd(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            superPointerDrag(event);

            modify.insertVertex_(getEndSegment(), event.mouseCoordinate);
            modify.dragSegments_.shift();
        }

        function unsnapEnd(event:SnappingPointerEvent):void {
            modify.removeVertex_();
            modify.dragSegments_.pop();
            modify.dragSegments_[0][0] = getEndSegment();
            modify.dragSegments_[0][1] = 1;
            superPointerDrag(event);
        }

        function getStartSegment():ol.interaction.SegmentDataType {
            return getSegmentAt(getGeometry().getFirstCoordinate());
        }

        function getEndSegment():ol.interaction.SegmentDataType {
            return getSegmentAt(getGeometry().getLastCoordinate());
        }

        function getSegmentAt(coordinate:ol.Coordinate):ol.interaction.SegmentDataType {
            var equals = _.partial(ol.coordinate.equals, coordinate);

            return _.find(modify.rBush_.getAll(), (segment:ol.interaction.SegmentDataType):boolean => {
                return equals(segment.segment[0]) || equals(segment.segment[1]);
            });
        }

        function numVertices():number {
            var line = <ol.geometry.LineString> getGeometry();
            return line.getCoordinates().length;
        }

        function deactivate():void {
            monitor.moveAtEnd.remove(superPointerDrag);
            monitor.moveAtStart.remove(superPointerDrag);
            monitor.moveOutside.remove(superPointerDrag);
            monitor.snapInEnd.remove(snapToEnd);
            monitor.snapInStart.remove(snapToStart);
            monitor.snapOutEnd.remove(unsnapEnd);
            monitor.snapOutStart.remove(unsnapStart);

            if (!modify) return;

            if (modify.handlePointerDrag === updateMonitor) modify.handlePointerDrag = superPointerDrag;
            if (modify.handlePointerUp === stopDragging) modify.handlePointerUp = superPointerUp;
            modify = null;
        }

    }

    angular
        .module(MODULE)
        .run(AddingModifyStrategy);

}
