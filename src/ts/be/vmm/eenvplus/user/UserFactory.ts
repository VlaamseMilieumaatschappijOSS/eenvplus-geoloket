///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.user.UserFactory {
    'use strict';

    export var NAME:string = PREFIX + 'UserFactory';

    var loginUrl = '/realms/:realm/tokens/grants/access';

    factory.$inject = ['$resource', 'epKeycloak'];

    function factory(resource:ng.resource.IResourceService, keycloak:kc.Keycloak):User {
        console.log(keycloak);
        var service = resource(keycloak.authServerUrl + loginUrl, {
                realm: keycloak.realm
            }, {
                login: {
                    method: 'POST',
                    isArray: false,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }
            }),
            user:User = {
                authenticated: keycloak.authenticated,
                hasRole: keycloak.hasRealmRole,
                login: login,
                logout: keycloak.logout
            };

        if (user.authenticated) {
            user.username = keycloak.tokenParsed.preferred_username;
            user.name = keycloak.tokenParsed.name;
        }

        return user;

        function login(username:string, password:string):void {
            service['login']({}, jQuery.param({
                username: username,
                password: password,
                client_id: keycloak.clientId
            }), () => {
                console.log(arguments);
            });
        }
    }

    angular
        .module(MODULE)
        .factory(NAME, factory);

}
