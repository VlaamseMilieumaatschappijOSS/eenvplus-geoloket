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


        factory.$inject = ['$q', 'epUser'];

        function factory(q:ng.IQService, user:User):AuthInterceptor {
            return {
                request: request,
                responseError: responseError
            };

            function request(config:ng.IRequestConfig):any {
                return user.authenticated ? addTokenToHeaders(config) : config;
            }

            function addTokenToHeaders(config:ng.IRequestConfig):ng.IRequestConfig {
                config.headers = config.headers || {};
                config.headers.Authorization = user.authHeader;
                return config;
            }

            function responseError(rejection:ng.IHttpPromiseCallbackArg<string>):ng.IPromise<any> {
                if (rejection.status === 401) {
                    alert('Your session has timed out!');
                    user.logout();
                }
                return q.reject(rejection);
            }

        }

        angular
            .module(MODULE)
            .config(configureHttpProvider);
    }

}
