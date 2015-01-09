module be.vmm.eenvplus.config {
    'use strict';

    export interface GlobalOptions {
        mapUrl:string;
        apiUrl:string;
        cachedApiUrl:string;
        resourceUrl:string;
        ogcproxyUrl:string;
        whitelist:string[];
    }

    var cacheAdd = '${version}' != '' ? '/' + '${version}' : '',
        pathname = location.pathname.replace(/(index.html)|(mobile.html)/g, '');

    export var GlobalOptions:GlobalOptions = {
        mapUrl: location['origin'] + '${apache_base_path}',
        apiUrl: location.protocol + '${api_url}',
        cachedApiUrl: location.protocol + '${api_url}' + cacheAdd,
        resourceUrl: location['origin'] + pathname + '${versionslashed}',
        ogcproxyUrl: location.protocol + '${api_url}' + '/ogcproxy?url=',
        whitelist: [
            'http://www.kmlvalidator.org/validate.htm'
        ]
    }

}
