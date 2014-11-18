(function () {
    goog.provide('ga_config');

    goog.require('ga_map_config_service');
    goog.require('ga_srs_name_service');

    angular.module('ga_config', [
        'ga_map_config_service',
        'ga_srs_name_service'
    ]);
})();
