(function() {
  goog.provide('ga_contextpopup_directive');

  goog.require('ga_networkstatus_service');
  goog.require('ga_permalink');

  var module = angular.module('ga_contextpopup_directive', [
    'ga_networkstatus_service',
    'ga_permalink',
    'ep_config'
  ]);

  module.directive('gaContextPopup',
      function($http, $q, $timeout, $window, gaBrowserSniffer, gaNetworkStatus,
          gaPermalink, epSRSName, SRID) {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'components/contextpopup/partials/contextpopup.html',
          scope: {
            map: '=gaContextPopupMap',
            options: '=gaContextPopupOptions'
          },
          link: function(scope, element, attrs) {
            var heightUrl = scope.options.heightUrl;
            var qrcodeUrl = scope.options.qrcodeUrl;

            // The popup content is updated (a) on contextmenu events,
            // and (b) when the permalink is updated.

            var map = scope.map;
            var view = map.getView();

            var coordDefault;
            var popoverShown = false;

            var overlay = new ol.Overlay({
              element: element[0],
              stopEvent: true
            });
            map.addOverlay(overlay);

            scope.showQR = function() {
              return !gaBrowserSniffer.mobile && !gaNetworkStatus.offline;
            };

            var formatCoordinates = function(coord, prec, ignoreThousand) {
              var fCoord = ol.coordinate.toStringXY(coord, prec);
              if (!ignoreThousand) {
                 fCoord = fCoord.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
              }
              return fCoord;
            };

            var coordinatesFormatUTM = function(coordinates, zone) {
              var coord = ol.coordinate.toStringXY(coordinates, 0).
                replace(/\B(?=(\d{3})+(?!\d))/g, "'");
              return coord + ' ' + zone;
            };

            var handler = function(event) {
              event.stopPropagation();
              event.preventDefault();

              //On Max, left-click with ctrlKey also fires
              //the 'contextmenu' event. But this conflicts
              //with selectByRectangl feature (in featuretree
              //directive). So we bail out here if
              //ctrlKey is pressed
              if (event.ctrlKey) {
                return;
              }

              var wgs84 = epSRSName.byId(SRID.WGS84),
                  utm = epSRSName.byId(SRID.UTM);
              var pixel = (event.originalEvent) ?
                  map.getEventPixel(event.originalEvent) :
                  event.pixel;
              coordDefault = (event.originalEvent) ?
                  map.getEventCoordinate(event.originalEvent) :
                  event.coordinate;
              var coordWGS84 = ol.proj.transform(coordDefault,
                  epSRSName.default.code, wgs84.code);

              // recenter on phones
              if (gaBrowserSniffer.phone) {
                var pan = ol.animation.pan({
                  duration: 200,
                  source: view.getCenter()
                });
                map.beforeRender(pan);
                view.setCenter(coordDefault);
              }

              scope.coordDefault = formatCoordinates(coordDefault, 1);
              scope.coordWGS84 = formatCoordinates(coordWGS84, 5, true);
              if (coordWGS84[0] < 6 && coordWGS84[0] >= 0) {
                var utm_31t = ol.proj.transform(coordWGS84,
                  wgs84.code, utm.code);
                scope.coordutm = coordinatesFormatUTM(utm_31t, '(zone 31T)');
              } else if (coordWGS84[0] < 12 && coordWGS84[0] >= 6) {
                var utm_32t = ol.proj.transform(coordWGS84,
                  wgs84.code, utm.authority + ':' + (utm.srid + 1));
                scope.coordutm = coordinatesFormatUTM(utm_32t, '(zone 32T)');
              } else {
                return '-';
              }

              coordWGS84['lon'] = coordWGS84[0];
              coordWGS84['lat'] = coordWGS84[1];
              scope.coordmgrs = $window.proj4.mgrs.forward(coordWGS84).
                  replace(/(.{5})/g, '$1 ');
              scope.altitude = '-';

              // A digest cycle is necessary for $http requests to be
              // actually sent out. Angular-1.2.0rc2 changed the $evalSync
              // function of the $rootScope service for exactly this. See
              // Angular commit 6b91aa0a18098100e5f50ea911ee135b50680d67.
              // We use a conservative approach and call $apply ourselves
              // here, but we instead could also let $evalSync trigger a
              // digest cycle for us.
              scope.$apply(function() {

                $http.get(heightUrl, {
                  params: {
                    easting: coordDefault[0],
                    northing: coordDefault[1],
                    elevation_model: 'COMB'
                  }
                }).success(function(response) {
                  scope.altitude = parseFloat(response.height);
                });
              });

              updatePopupLinks();

              view.once('change:center', function() {
                hidePopover();
              });

              overlay.setPosition(coordDefault);
              showPopover();
            };


            if (gaBrowserSniffer.events.menu) {
              // On surface tablet a 'contextmenu' event is triggered
              // on long press.
              // Listen to contextmenu events from the viewport.
              $(map.getViewport()).on(gaBrowserSniffer.events.menu, handler);
              element.on(gaBrowserSniffer.events.menu, 'a', function(e) {
                e.stopPropagation();
              });

            } else {
              // On touch devices and browsers others than ie10, display the
              // context popup after a long press (300ms)
              var startPixel, holdPromise;
              map.on('pointerdown', function(event) {
                $timeout.cancel(holdPromise);
                startPixel = event.pixel;
                holdPromise = $timeout(function() {
                  handler(event);
                }, 300, false);
              });
              map.on('pointerup', function(event) {
                $timeout.cancel(holdPromise);
                startPixel = undefined;
              });
              map.on('pointermove', function(event) {
                if (startPixel) {
                  var pixel = event.pixel;
                  var deltaX = Math.abs(startPixel[0] - pixel[0]);
                  var deltaY = Math.abs(startPixel[1] - pixel[1]);
                  if (deltaX + deltaY > 6) {
                    $timeout.cancel(holdPromise);
                    startPixel = undefined;
                  }
                }
              });
            }
            // Listen to permalink change events from the scope.
            scope.$on('gaPermalinkChange', function(event) {
              if (angular.isDefined(coordDefault) && popoverShown) {
                updatePopupLinks();
              }
            });

            scope.hidePopover = function(evt) {
              if (evt) {
                evt.stopPropagation();
              }
              hidePopover();
            };

            function showPopover() {
              element.css('display', 'block');
              popoverShown = true;
            }

            function hidePopover() {
              element.css('display', 'none');
              popoverShown = false;
            }

            function updatePopupLinks() {
              var p = {
                X: Math.round(coordDefault[1], 1),
                Y: Math.round(coordDefault[0], 1)
              };

              var contextPermalink = gaPermalink.getHref(p);
              scope.contextPermalink = contextPermalink;

              scope.crosshairPermalink = gaPermalink.getHref(
                  angular.extend({crosshair: 'bowl'}, p));

              if (!gaBrowserSniffer.mobile) {
                scope.qrcodeUrl = qrcodeUrl +
                  '?url=' +
                  escape(contextPermalink);
              }
            }
          }
        };
        });
})();
