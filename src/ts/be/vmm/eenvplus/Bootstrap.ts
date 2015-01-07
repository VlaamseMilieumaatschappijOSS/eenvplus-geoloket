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
            .constant('epKeycloak', keycloak);

        keycloak
            .init({onLoad: 'check-sso'})
            .success(_.partial(angular.bootstrap, document, [APP_NAME]))
            .error(_.partial(alert, 'Failed to authenticate'));
    }

}
