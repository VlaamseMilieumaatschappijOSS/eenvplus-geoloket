(function () {
    goog.provide('ga_srs_name_service');

    angular
        .module('ga_srs_name_service', [])
        .constant('AUTHORITY', 'EPSG')
        .constant('SRID', {
            LAMBERT: 31370
        })
        .factory('gaSRSName', SRSNameService);

    function SRSNameService(AUTHORITY, SRID) {
        return {
            default: {
                srid: SRID.LAMBERT,
                code: AUTHORITY + ':' + SRID.LAMBERT,
                label: 'Belgian Lambert'
            }
        };
    }
})();
