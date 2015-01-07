///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.user.UserFactory {
    'use strict';

    export var NAME:string = PREFIX + 'UserService';

    factory.$inject = ['epKeycloak'];

    function factory(keycloak:kc.Keycloak):User {
        var user:User = {
            authenticated: keycloak.authenticated,
            hasRole: keycloak.hasRealmRole,
            login: keycloak.login,
            logout: keycloak.logout
        };

        if (user.authenticated) {
            user.username = keycloak.tokenParsed.preferred_username;
            user.name = keycloak.tokenParsed.name;
        }

        return user;
    }

    angular
        .module(MODULE)
        .factory(NAME, factory);

}
