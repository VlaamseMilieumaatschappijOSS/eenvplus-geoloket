(function() {
	goog.provide('ga_feature');

	goog.require('ga_feature_service');
	goog.require('ga_feature_layer');

	angular.module('ga_feature', ['ga_feature_service', 'ga_feature_layer']);
})();
