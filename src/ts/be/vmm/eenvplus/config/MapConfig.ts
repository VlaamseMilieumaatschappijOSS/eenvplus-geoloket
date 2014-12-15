///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.config {
    'use strict';

    export interface MapConfig {
        extent:ol.Extent;
        origin:ol.Coordinate;
        resolution:number;
        resolutions:number[];
        tileSize:number;
    }

    export module MapConfig {
        export var NAME:string = 'epMapConfig';

        var mapConfig = {
            extent: [9928, 66928, 272072, 329072],
            origin: [9928, 329072],
            resolution: 1024,
            resolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
            tileSize: 256
        };

        angular
            .module(MODULE)
            .constant(NAME, mapConfig);
    }

}
