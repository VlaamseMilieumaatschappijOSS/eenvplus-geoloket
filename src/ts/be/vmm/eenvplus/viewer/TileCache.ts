///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.viewer {
    'use strict';

    export interface invalidateTileCache {
        ():void;
    }

    export module TileCache {
        export var NAME:string = PREFIX + 'TileCache';

        factory.$inject = ['epMap'];

        function factory(map:ol.Map):invalidateTileCache {
            return function refresh():void {
                _(map.getLayers().getArray())
                    .filter('displayInLayerManager')
                    .reject({bodId: 'be.vmm.waterlopen'})
                    .invoke(ol.layer.Tile.prototype.getSource)
                    .each(updateUrls);
            };

            function updateUrls(source:ol.source.TileWMS):void {
                source.setUrls(source.getUrls().map(addTimestamp));
            }

            function addTimestamp(url:string):string {
                return url + '&time=' + _.now();
            }

        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
