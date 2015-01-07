module be.vmm.eenvplus.user {
    'use strict';

    export interface User {
        authenticated: boolean;
        username?:string;
        name?:string;

        hasRole(role:string):boolean;
        login():void;
        logout():void;
    }

}
