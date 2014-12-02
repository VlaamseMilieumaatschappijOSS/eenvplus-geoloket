module be.vmm.eenvplus.config {
    'use strict';

    export interface SRSNameService {
        default:SRSName;
        byId(srid:number):SRSName;
    }

    export interface SRSName {
        authority:string;
        code:string;
        label:string;
        srid:number;
    }

}
