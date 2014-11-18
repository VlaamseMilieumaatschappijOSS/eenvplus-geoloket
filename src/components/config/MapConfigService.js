(function () {
    goog.provide('ga_map_config_service');

    angular
        .module('ga_map_config_service', [])
        .constant('MAP_CONFIG', {
            extent: [9928, 66928, 272072, 329072],
            origin: [9928, 329072],
            resolution: 1024,
            resolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
            tileSize: 256
        });
})();
