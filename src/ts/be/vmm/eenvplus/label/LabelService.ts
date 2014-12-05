///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

module be.vmm.eenvplus.label {
    'use strict';

    export interface LabelService {
        getLabels(type:LabelType):ng.resource.IResourceArray<Label>;
    }

    export module LabelService {
        export var NAME:string = PREFIX + 'LabelService';

        var url = '/rest/services/:mapId/CodeServer/:type',
            labelPackage = 'be.vmm.eenvplus.sdi.model.code',
            locale = 'en',
            typeModelMap = [
                'RioolLinkType',
                'Namespace',
                'SewerWaterType'
            ].map(path);

        factory.$inject = ['$resource', 'gaGlobalOptions'];

        function factory(resource:ng.resource.IResourceService, config:ga.GlobalOptions):LabelService {
            var service = resource<Label>(config.apiUrl + url, {}, {
                query: {
                    method: 'GET',
                    params: {locale: locale},
                    isArray: true
                }
            });

            return {
                getLabels: getLabels
            };

            function getLabels(type:LabelType):ng.resource.IResourceArray<Label> {
                if (!typeModelMap[type]) throw new Error("No model defined for LabelType " + type);

                return service.query({
                    mapId: 0,
                    type: typeModelMap[type]
                });
            }
        }

        function path(name:string):string {
            return labelPackage + '.' + name;
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
