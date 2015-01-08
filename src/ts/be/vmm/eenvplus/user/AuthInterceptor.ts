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


        factory.$inject = ['epUser'];

        function factory(user:User):AuthInterceptor {
            return {
                request: request
            };

            function request(config:ng.IRequestConfig):any {
                return user.authenticated ? addTokenToHeaders(config) : config;
            }

            function addTokenToHeaders(config:ng.IRequestConfig):ng.IRequestConfig {
                config.headers = config.headers || {};
                config.headers.Authorization = user.authHeader;
                return config;
            }
        }

        angular
            .module(MODULE)
            .config(configureHttpProvider);
    }

}
