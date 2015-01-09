///ts:ref=Module
/// <reference path="./Module.ts"/> ///ts:ref:generated
///ts:ref=Keycloak
/// <reference path="./config/Keycloak.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.Bootstrap {
    'use strict';

    export var APP_NAME:string = 'ga';

    /**
     * Initiate boot sequence.
     *
     * Note: we can't boot immediately because we depend on some of the original geo-admin stuff being loaded.
     */
    export function start() {
        var keycloak = Keycloak(config.keycloak);

        angular
            .module(APP_NAME)
            .constant('gaGlobalOptions', config.GlobalOptions)
            .constant('epKeycloak', keycloak)
            .config(configureI18n)
            .config(configureLayers)
            .config(configureFeaturePreview)
            .config(configureProfileService)
            .config(configureWhiteList);

        keycloak
            .init({onLoad: 'check-sso'})
            .success(_.partial(angular.bootstrap, document, [APP_NAME]))
            .error(_.partial(alert, 'Failed to authenticate'));
    }


    configureI18n.$inject = ['$translateProvider'];

    function configureI18n(i18n:any):void {
        i18n.useStaticFilesLoader({
            prefix: '${versionslashed}locales/',
            suffix: '.json'
        });
    }


    configureLayers.$inject = ['gaLayersProvider', 'gaGlobalOptions'];

    function configureLayers(layers:any, options:config.GlobalOptions):void {
        _.assign(layers, {
            wmtsGetTileUrlTemplate: '${wmts_url}',
            layersConfigUrlTemplate: options.cachedApiUrl + '/rest/services/all/MapServer/layersConfig?lang={Lang}',
            legendUrlTemplate: options.cachedApiUrl + '/rest/services/{Topic}/CatalogServer/{Layer}/legend?lang={Lang}'
        });
    }


    configureFeaturePreview.$inject = ['gaPreviewFeaturesProvider', 'gaGlobalOptions'];

    function configureFeaturePreview(previewFeatures:any, options:config.GlobalOptions):void {
        previewFeatures.url = options.cachedApiUrl + '/rest/services/all/MapServer/';
    }


    configureProfileService.$inject = ['gaProfileServiceProvider', 'gaGlobalOptions'];

    function configureProfileService(profiles:any, options:config.GlobalOptions):void {
        profiles.d3libUrl = options.resourceUrl + 'lib/d3-3.3.1.min.js';
    }


    configureWhiteList.$inject = ['$sceDelegateProvider', 'gaGlobalOptions'];

    function configureWhiteList($sceDelegateProvider, options:config.GlobalOptions):void {
        var whiteList = $sceDelegateProvider.resourceUrlWhitelist();
        whiteList = whiteList.concat(options.whitelist);
        $sceDelegateProvider.resourceUrlWhitelist(whiteList);
    }

}
