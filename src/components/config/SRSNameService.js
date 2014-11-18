(function () {
    goog.provide('ga_srs_name_service');

    angular
        .module('ga_srs_name_service', [])
        .constant('AUTHORITY', 'EPSG')
        .constant('SRID', {
            LAMBERT72: 31370,
            WGS84: 4326,
            UTM: 32631
        })
        .factory('gaSRSName', SRSNameService);

    function SRSNameService(AUTHORITY, SRID) {
        var srsNames = [
            {srid: SRID.LAMBERT72, label: 'Lambert 72'},
            {srid: SRID.WGS84, label: 'WGS 84 (lat/lon)'},
            {srid: SRID.UTM, label: 'UTM'}
        ];

        srsNames.forEach(setCode);

        return {
            default: byId(SRID.LAMBERT72),
            byId: byId
        };

        function setCode(srsName) {
            srsName.authority = AUTHORITY;
            srsName.code = AUTHORITY + ':' + srsName.srid
        }

        function byId(srid) {
            return srsNames.filter(function (srsName) {
                return srsName.srid === srid;
            })[0];
        }
    }
})();
