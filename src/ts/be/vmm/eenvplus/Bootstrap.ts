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
    export function start():void {
        var keycloak = Keycloak(config.keycloak);

        angular
            .module(APP_NAME)
            .constant('gaGlobalOptions', config.GlobalOptions)
            .constant('epKeycloak', keycloak)
            .config(configureI18n)
            .config(configureLayers)
            .config(configureFeaturePreview)
            .config(configureProfileService)
            .config(configureWhiteList)
            .factory('$exceptionHandler', catchAll);

        keycloak
            .init({onLoad: 'check-sso'})
            .success(_.partial(angular.bootstrap, document, [APP_NAME]))
            .error(_.partial(alert, 'Failed to authenticate'));
    }


    configureI18n.$inject = ['$translateProvider'];

    function configureI18n(i18n:ng.translate.ITranslateProvider):void {
        i18n.useStaticFilesLoader({
            prefix: '${versionslashed}locales/',
            suffix: '.json'
        });
    }


    configureLayers.$inject = ['gaLayersProvider', 'gaGlobalOptions'];

    function configureLayers(layers:ga.components.map.Layers, options:config.GlobalOptions):void {
        _.assign(layers, {
            wmtsGetTileUrlTemplate: '${wmts_url}',
            layersConfigUrlTemplate: options.cachedApiUrl + '/rest/services/all/MapServer/layersConfig?lang={Lang}',
            legendUrlTemplate: options.cachedApiUrl + '/rest/services/{Topic}/CatalogServer/{Layer}/legend?lang={Lang}'
        });
    }


    configureFeaturePreview.$inject = ['gaPreviewFeaturesProvider', 'gaGlobalOptions'];

    function configureFeaturePreview(previewFeatures:ga.components.map.PreviewFeatures,
                                     options:config.GlobalOptions):void {
        previewFeatures.url = options.cachedApiUrl + '/rest/services/all/MapServer/';
    }


    configureProfileService.$inject = ['gaProfileServiceProvider', 'gaGlobalOptions'];

    function configureProfileService(profiles:ga.components.profile.ProfileService,
                                     options:config.GlobalOptions):void {
        profiles.d3libUrl = options.resourceUrl + 'lib/d3-3.3.1.min.js';
    }


    configureWhiteList.$inject = ['$sceDelegateProvider', 'gaGlobalOptions'];

    function configureWhiteList(delegate:ng.ISCEDelegateProvider, options:config.GlobalOptions):void {
        var whiteList = delegate.resourceUrlWhitelist();
        whiteList = whiteList.concat(options.whitelist);
        delegate.resourceUrlWhitelist(whiteList);
    }

    function catchAll() {
        return function (exception) {
            alert(exception.message);
            throw exception;
        };
    }

}
