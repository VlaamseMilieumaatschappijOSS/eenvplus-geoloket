///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.user {
    'use strict';

    export interface User {
        authenticated:boolean;
        authHeader?:string;
        username?:string;
        name?:string;

        hasRole(role:string):boolean;
    }

    export module Model {
        export var NAME:string = PREFIX + 'User';

        angular
            .module(MODULE)
            .constant(NAME, {authenticated: false});
    }

}
