///ts:ref=Module
/// <reference path="../../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.editor.snapping {
    'use strict';

    MergingModifyStrategy.$inject = ['epMap', 'epSnappingState', 'epSnappingMonitor'];

    function MergingModifyStrategy(map:ol.Map, state:StateController<SnappingType>, monitor:SnappingMonitor):void {

        var modify:geometry.ModifyPrivate,
            superPointerMove;

        state(SnappingType.MERGE, activate, deactivate, canActivate);

        function canActivate():boolean {
            modify = _.find(map.getInteractions().getArray(), isActiveModify);
            return !!modify;
        }

        function isActiveModify(interaction:ol.interaction.Interaction):boolean {
            return interaction instanceof ol.interaction.Modify && interaction.getActive();
        }

        function activate():void {
            modify.handlePointerMove_ = handlePointerMove;

            var proto = <geometry.ModifyPrivate> ol.interaction.Modify.prototype;
            superPointerMove = proto.handlePointerMove_.bind(modify);

            monitor.moveAtEnd.add(_.partial(console.log, 'moveAtEnd'));
            monitor.moveAtStart.add(_.partial(console.log, 'moveAtStart'));
            monitor.moveOutside.add(_.partial(console.log, 'moveOutside'));
            monitor.snapInEnd.add(_.partial(console.log, 'snapInEnd'));
            monitor.snapInStart.add(_.partial(console.log, 'snapInStart'));
            monitor.snapOutEnd.add(_.partial(console.log, 'snapOutEnd'));
            monitor.snapOutStart.add(_.partial(console.log, 'snapOutStart'));
        }

        function handlePointerMove(event:ol.MapBrowserPointerEvent):void {
            console.log(modify.vertexFeature_ ?
                    (<ol.geometry.LineString> modify.vertexFeature_.getGeometry()).getCoordinates() :
                    undefined
            );
            monitor.update(event, modify.vertexFeature_);
            superPointerMove(event);
        }

        function deactivate():void {

        }

    }

    angular
        .module(MODULE)
        .run(MergingModifyStrategy);

}
