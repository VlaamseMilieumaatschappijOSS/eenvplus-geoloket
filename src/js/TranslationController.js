(function() {
  goog.provide('ga_translation_controller');

  var module = angular.module('ga_translation_controller', []);

  module.controller('GaTranslationController',
      function($scope) {

        $scope.options = {
          langs: [
            {label: 'NL', value: 'nl'},
            {label: 'EN', value: 'en'}
          ],
          fallbackCode: 'en'
        };

      });

})();
