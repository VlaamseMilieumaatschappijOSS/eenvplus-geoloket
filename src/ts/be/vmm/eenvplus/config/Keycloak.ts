///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.config {
    'use strict';

    var rootUrl = location.protocol + '//' + location.hostname + (location.port && (':' + location.port));

    export var keycloak = {
        url: rootUrl + '/auth',
        realm: 'eenvplus',
        clientId: 'eenvplus-geoloket'
    };

}
