declare var kc:kc.Static;

declare function Keycloak(config:kc.Config):kc.Keycloak;

declare module kc {

    interface Static {
        Keycloak(config:Config):Keycloak;
    }

    interface AuthOptions {
        /**  specifies the uri to redirect to after login */
        redirectUri:string;
    }

    interface Config {
        clientId:string;
        realm:string;
        url?:string;
    }

    interface InitOptions {
        /**
         * specifies an action to do on load
         * @enum 'login-required', 'check-sso'
         */
        onLoad?:string;
        /** set an initial value for the token */
        token?:string;
        /** set an initial value for the refresh token */
        refreshToken?:string;
        /**
         * set to enable/disable monitoring login state
         * @default true
         */
        checkLoginIframe?:boolean;
        /**
         * set the interval to check login state
         * @default 5 seconds
         */
        checkLoginIframeInterval?:number;
    }

    interface Keycloak {
        /** true if the user is authenticated */
        authenticated:boolean;
        /** the id token if claims is enabled for the application, null otherwise */
        idToken:string;
        /** the realm roles associated with the token */
        realmAccess:any[];
        /** the base64 encoded token that can be used to retrieve a new token */
        refreshToken:string;
        /** the parsed refresh token */
        refreshTokenParsed:Token;
        /** the resource roles assocaited with the token */
        resourceAccess:any[];
        /** the user id */
        subject:number;
        /** the base64 encoded token that can be sent in the Authorization header in requests to services */
        token:string;
        /** the parsed token */
        tokenParsed:Token;

        init(options?:InitOptions):Promise<boolean>;
        /**
         * @param role
         * @returns true if the token has the given realm role
         */
        hasRealmRole(role:string):boolean;
        /**
         * @param role
         * @param resource (default: clientId)
         * @returns true if the token has the given role for the resource
         */
        hasResourceRole(role:string, resource:any):boolean;
        /**
         * Redirects to login form.
         * @param options
         * @returns an empty Promise
         */
        login(options?:LoginOptions):Promise<void>;
        /**
         * Redirects to logout.
         * @param options
         * @returns an empty Promise
         */
        logout(options?:AuthOptions):Promise<void>;
        /**
         * If the token expires within `minValidity` seconds the token is refreshed.
         * If the session status iframe is enabled, the session status is also checked.
         * @param minValidity (default: 0)
         * @returns a promise to set functions that can be invoked if the token is still valid, or if the token is no
         * longer valid.
         */
        updateToken(minValidity?:number):Promise<boolean>;
    }

    interface LoginOptions extends AuthOptions {
        /**
         * can be set to 'none' to check if the user is logged in already
         * (if not logged in a login form is not displayed)
         * @enum 'none'
         */
        prompt:string;
        /** used to pre-fill the username/email field on the login form */
        loginHint:string;
    }

    interface Promise<T> {
        success(handler:(result:T) => void):Promise<T>;
        error(handler:() => void):Promise<T>;
    }

    interface Token {
        name:string;
        preferred_username:string;
    }

}
