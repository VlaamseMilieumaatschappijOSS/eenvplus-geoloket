///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    MergingModifyStrategy.$inject = ['epMap', 'epSnappingState', 'epSnappingMonitor', 'epFeatureManager'];

    function MergingModifyStrategy(map:ol.Map,
                                   state:StateController<SnappingType>,
                                   monitor:SnappingMonitor,
                                   featureManager:feature.FeatureManager):void {

        var modify:geometry.ModifyPrivate,
            moddedFeature:ol.Feature,
            updateMonitor,
            superPointerMove,
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

            updateMonitor = _.partialRight(monitor.update, moddedFeature);
            modify.handlePointerMove_ = updateMonitor;
            modify.handlePointerDrag = updateMonitor;

            var proto = <geometry.ModifyPrivate> ol.interaction.Modify.prototype;
            superPointerMove = proto.handlePointerMove_.bind(modify);
            superPointerDrag = proto.handlePointerDrag.bind(modify);

            monitor.setFilter(canSnap);
            monitor.moveAtEnd.add(moveAtNode);
            monitor.moveAtStart.add(moveAtNode);
            monitor.moveOutside.add(moveOrDrag);
        }

        function canSnap(node:ol.Feature):boolean {
            return !featureManager.isConnectedNode(node.getId());
        }

        function moveAtNode(event:SnappingPointerEvent):void {
            event.coordinate = event.snappedCoordinate;
            moveOrDrag(event);
        }

        function moveOrDrag(event:SnappingPointerEvent):void {
            event.type === ol.MapBrowserEvent.EventType.POINTERDRAG ?
                superPointerDrag(event) :
                superPointerMove(event);
        }

        function deactivate():void {
            monitor.setFilter(null);
            monitor.moveAtEnd.remove(moveAtNode);
            monitor.moveAtStart.remove(moveAtNode);
            monitor.moveOutside.remove(moveOrDrag);

            if (!modify) return;

            if (modify.handlePointerMove_ === updateMonitor) modify.handlePointerMove_ = superPointerMove;
            if (modify.handlePointerDrag === updateMonitor) modify.handlePointerDrag = superPointerDrag;
            modify = null;
        }

    }

    angular
        .module(MODULE)
        .run(MergingModifyStrategy);

}
