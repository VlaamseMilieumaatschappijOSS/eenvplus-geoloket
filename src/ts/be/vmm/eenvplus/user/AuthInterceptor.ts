///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.user {
    'use strict';

    export interface AuthInterceptor {
        request(config:ng.IRequestConfig):any;
    }

    export module AuthInterceptor {

        configureHttpProvider.$inject = ['$httpProvider'];

        function configureHttpProvider(http:ng.IHttpProvider):void {
            http.interceptors.push(factory);
        }


        factory.$inject = ['$q', 'epKeycloak'];

        function factory(q:ng.IQService, keycloak:kc.Keycloak):AuthInterceptor {
            return {
                request: request
            };

            function request(config:ng.IRequestConfig):any {
                var addTokenToConfig = _.partial(addTokenToHeaders, config);
                return keycloak.authenticated ? q(resolver) : config;

                function resolver(resolve:ng.IQResolveReject<ng.IRequestConfig>,
                                  reject:ng.IQResolveReject<string>):void {
                    keycloak
                        .updateToken()
                        .success(_.compose(resolve, addTokenToConfig))
                        .error(_.partial(reject, 'Failed to refresh token'));
                }
            }

            function addTokenToHeaders(config:ng.IRequestConfig):ng.IRequestConfig {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + keycloak.token;
                return config;
            }
        }

        angular
            .module(MODULE)
            .config(configureHttpProvider);
    }

}
