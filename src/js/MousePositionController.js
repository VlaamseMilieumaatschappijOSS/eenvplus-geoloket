(function() {
  goog.provide('ga_mouseposition_controller');

  var module = angular.module('ga_mouseposition_controller', [
    'pascalprecht.translate',
    'ep_config'
  ]);

  module.controller('GaMousePositionController',
      function($scope, $translate, $window, epSRSName, SRID) {
        var coordinatesFormat = function(coordinates) {
          return $translate('coordinates_label') + ': ' +
              ol.coordinate.toStringXY(coordinates, 0).
                replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

        var coordinatesFormatUTM = function(coordinates, zone) {
          var coord = ol.coordinate.toStringXY(coordinates, 0).
            replace(/\B(?=(\d{3})+(?!\d))/g, "'");
          return coord + ' ' + zone;
        };

        var wgs84 = epSRSName.byId(SRID.WGS84),
            utm = epSRSName.byId(SRID.UTM);

        $scope.mousePositionProjections = [{
          value: epSRSName.default.code,
          label: epSRSName.default.label,
          format: coordinatesFormat
        }, {
          value: wgs84.code,
          label: wgs84.label,
          format: function(coordinates) {
            return ol.coordinate.toStringHDMS(coordinates) +
                ' (' + ol.coordinate.toStringXY(coordinates, 5) + ')';
          }
        }, {
          value: wgs84.code,
          label: utm.label,
          format: function(coordinates) {
            if (coordinates[0] < 6 && coordinates [0] >= 0) {
              var utm_31t = ol.proj.transform(coordinates,
                wgs84.code, utm.code);
              return coordinatesFormatUTM(utm_31t, '(zone 31T)');
            } else if (coordinates[0] < 12 && coordinates [0] >= 6) {
              var utm_32t = ol.proj.transform(coordinates,
                wgs84.code, utm.authority + ':' + (utm.srid + 1));
              return coordinatesFormatUTM(utm_32t, '(zone 32T)');
            } else {
              return '-';
            }
          }
        }
        ];

        $scope.options = {
          projection: $scope.mousePositionProjections[0]
        };

      });

})();
