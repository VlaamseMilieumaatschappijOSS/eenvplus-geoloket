///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.user {
    'use strict';

    export interface UserService {
        user:User;
        login(username:string, password:string):ng.IPromise<void>;
        logout():void;
    }

    interface UserResource extends ng.resource.IResourceClass<any> {
        login(params:string):ng.resource.IResource<kc.rest.LoginResponse>;
    }

    export module UserService {
        export var NAME:string = PREFIX + 'UserService';

        var loginUrl = '/realms/:realm/tokens/grants/access',
            formContentType = 'application/x-www-form-urlencoded; charset=UTF-8',
            postConfig = {
                method: 'POST',
                isArray: false,
                headers: {'Content-Type': formContentType}
            };

        factory.$inject = ['$resource', 'epUser', 'epKeycloak'];

        function factory(resource:ng.resource.IResourceService, user:User, keycloak:kc.Keycloak):UserService {
            var service = <UserResource> resource(keycloak.authServerUrl + loginUrl, {
                realm: keycloak.realm
            }, {
                login: postConfig
            });

            return {
                user: updateUser(user),
                login: login,
                logout: keycloak.logout
            };

            function login(username:string, password:string):ng.IPromise<void> {
                return service
                    .login(jQuery.param(createRequest(username, password))).$promise
                    .then(handleLogin);
            }

            function handleLogin(response:kc.rest.LoginResponse):void {
                keycloak.setToken(response.access_token, response.refresh_token);
                user.authHeader = response.token_type + ' ' + keycloak.token;
                updateUser(user);
            }

            function updateUser(user:User):User {
                if (user.authenticated = keycloak.authenticated) {
                    user.username = keycloak.tokenParsed.preferred_username;
                    user.name = keycloak.tokenParsed.name;
                    user.hasRole = keycloak.hasRealmRole;
                }
                else {
                    user.username = user.name = null;
                    user.hasRole = _.constant(false);
                }

                return user;
            }

            function createRequest(username:string, password:string):kc.rest.LoginRequest {
                return {
                    username: username,
                    password: password,
                    client_id: keycloak.clientId
                };
            }
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);

    }

}
