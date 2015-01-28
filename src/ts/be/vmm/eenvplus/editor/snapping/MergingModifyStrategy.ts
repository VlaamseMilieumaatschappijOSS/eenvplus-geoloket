///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    MergingModifyStrategy.$inject = ['epMap', 'epSnappingState', 'epSnappingMonitor'];

    function MergingModifyStrategy(map:ol.Map,
                                   state:StateController<SnappingType>,
                                   monitor:SnappingMonitor):void {

        var modify:geometry.ModifyPrivate,
            moddedFeature:ol.Feature,
            updateMonitor,
            superPointerDrag;

        state(SnappingType.MERGE, activate, deactivate, canActivate);

        function canActivate():boolean {
            modify = _.find(map.getInteractions().getArray(), isActiveModify);
            return !!modify;
        }

        function isActiveModify(interaction:ol.interaction.Interaction):boolean {
            return interaction instanceof ol.interaction.Modify && interaction.getActive();
        }

        function activate():void {
            moddedFeature = modify.features_.item(0);

            updateMonitor = _.partialRight(monitor.update, atStart);
            modify.handlePointerDrag = updateMonitor;

            var proto = <geometry.ModifyPrivate> ol.interaction.Modify.prototype;
            superPointerDrag = proto.handlePointerDrag.bind(modify);

            monitor.reset();
            monitor.moveAtEnd.add(moveAtNode);
            monitor.moveAtStart.add(moveAtNode);
            monitor.moveOutside.add(superPointerDrag);
        }

        function atStart():boolean {
            if (modify.dragSegments_.length !== 1) return false;

            var dragSegment = modify.dragSegments_[0],
                index = dragSegment[0].index + dragSegment[1];

            return !index;
        }

        function moveAtNode(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            superPointerDrag(event);
        }

        function deactivate():void {
            monitor.moveAtEnd.remove(moveAtNode);
            monitor.moveAtStart.remove(moveAtNode);
            monitor.moveOutside.remove(superPointerDrag);

            if (!modify) return;

            if (modify.handlePointerDrag === updateMonitor) modify.handlePointerDrag = superPointerDrag;
            modify = null;
        }

    }

    angular
        .module(MODULE)
        .run(MergingModifyStrategy);

}
