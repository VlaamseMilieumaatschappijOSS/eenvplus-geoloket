///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.viewer {
    'use strict';

    TileCache.$inject = ['epMap', 'epFeatureManager'];

    function TileCache(map:ol.Map, manager:feature.FeatureManager):void {
        manager.signal.push.add(handleModifications);

        function handleModifications(report:feature.model.ModificationReport):void {
            if (report.completed) refresh();
        }

        function refresh():void {
            _(map.getLayers().getArray())
                .filter('displayInLayerManager')
                .reject({bodId: 'be.vmm.waterlopen'})
                .invoke(ol.layer.Tile.prototype.getSource)
                .each(updateUrls);
        }

        function updateUrls(source:ol.source.TileWMS):void {
            source.setUrls(source.getUrls().map(setTimestamp));
        }

        function setTimestamp(url:string):string {
            var param = '&cache=' + _.now();
            return url.indexOf('&cache=') === -1 ? url + param : url.replace(/&cache=\d+/i, param);
        }

    }

    angular
        .module(MODULE)
        .run(TileCache);

}
