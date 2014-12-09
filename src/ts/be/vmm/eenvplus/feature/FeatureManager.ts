///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

import signal = Trasys.Signals;

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureJSONHandler {
        (json:model.FeatureJSON):void;
    }

    export interface Signals {
        create:signal.ITypeSignal<model.FeatureJSON>;
        load:signal.ISignal;
        remove:signal.ITypeSignal<model.FeatureJSON>;
        validate:signal.ITypeSignal<editor.validation.ValidationResult>;
    }

    export interface FeatureManager {
        create: FeatureJSONHandler;
        discard: FeatureJSONHandler;
        link: (featureJson:model.FeatureJSON, nodeJsons:model.FeatureJSON[]) => void;
        load: (extent:ol.Extent) => void;
        push: FeatureJSONHandler;
        signal: Signals;
        update: FeatureJSONHandler;
        validate: FeatureJSONHandler;
    }

    export module FeatureManager {
        export var NAME:string = PREFIX + 'FeatureManager';

        factory.$inject = ['$rootScope', '$q', 'gaFeatureManager'];

        function factory(rootScope:ng.IScope, q:ng.IQService, service:FeatureService):FeatureManager {
            var broadcast = rootScope.$broadcast.bind(rootScope),
                deselect = _.partial(broadcast, EVENT.selected, null),
                signals = {
                    create: new signal.TypeSignal<model.FeatureJSON>(),
                    load: new signal.Signal(),
                    remove: new signal.TypeSignal<model.FeatureJSON>(),
                    validate: new signal.TypeSignal<editor.validation.ValidationResult>()
                };

            signals.remove.add(deselect);

            return {
                create: create,
                discard: discard,
                link: link,
                load: load,
                push: push,
                signal: _.mapValues(signals, unary(_.bindAll)),
                update: update,
                validate: validate
            };

            function load(extent:ol.Extent):void {
                service.clear().then(_.partial(pull, extent));
            }

            function pull(extent:ol.Extent):void {
                service.pull(extent)
                    .then(signals.load.fire)
                    .catch(handleError('load'));
            }

            function create(json:model.FeatureJSON):ng.IPromise<model.FeatureJSON> {
                var deferred = q.defer<model.FeatureJSON>();

                service
                    .create(json)
                    .then(getSavedData)
                    .catch(handleError('create', json));

                return deferred.promise;

                function getSavedData(key:number):void {
                    service
                        .get(json.layerBodId, key)
                        .then(ensureProperties)
                        .then(deferred.resolve)
                        .catch(handleError('create', json));
                }
            }

            function link(featureJson:model.FeatureJSON, nodeJsons:model.FeatureJSON[]):void {
                if (nodeJsons.length === 1)
                    linkAppurtenance(featureJson, nodeJsons[0]);
                else linkSewer(featureJson, nodeJsons[0], nodeJsons[1]);
            }

            function linkSewer(sewer:model.FeatureJSON, startNode:model.FeatureJSON, endNode:model.FeatureJSON):void {
                var props = <model.RioolLink> sewer.properties;
                props.startKoppelPuntId = getId(startNode);
                props.endKoppelPuntId = getId(endNode);
                updateLink(sewer);
            }

            function linkAppurtenance(appurtenance:model.FeatureJSON, node:model.FeatureJSON):void {
                var props = <model.RioolAppurtenance> appurtenance.properties;
                props.koppelPuntId = getId(node);
                updateLink(appurtenance);
            }

            function updateLink(json:model.FeatureJSON):void {
                service
                    .update(json)
                    .catch(handleError('link update', json));
            }

            function update(json:model.FeatureJSON):void {
                service
                    .update(json)
                    .then(deselect)
                    .catch(handleError('update', json));
            }

            function validate():void {
                service
                    .test()
                    .then(_.compose(signals.validate.fire, enhance))
                    .catch(handleError('validate'));
            }

            function push():void {
                service
                    .push()
                    .then(_.compose(signals.validate.fire, enhance))
                    .catch(handleError('push'));
            }

            function enhance(validation:editor.validation.ValidationResult):editor.validation.ValidationResult {
                _.each(validation.results, (result:editor.validation.ValidationResult):void => {
                    // layerBodId should come from server
                    result['layerBodId'] = feature.typeModelMap[result.valid ? 2 : 0];
                });
                return validation;
            }

            function discard(json:model.FeatureJSON):void {
                if (json.id) {
                    // don't remove but reload old geometry
                }
                else {
                    // don't forget to remove connected mountpoints
                    service
                        .remove(json)
                        .then(_.partial(signals.remove.fire, json))
                        .catch(handleError('discard', json));
                }
            }

            function getId(json:model.FeatureJSON):string {
                return json.id ? json.id.toString() : '#' + json.key;
            }

            function ensureProperties(json:model.FeatureJSON):model.FeatureJSON {
                json.properties = json.properties || <model.FeatureProperties> {};
                return json;
            }

            function handleError(operation:string, data?:model.FeatureJSON):(error:Error) => void {
                return function createErrorHandler(error:Error):void {
                    console.error('Failed to ' + operation + ' feature', data, error);
                }
            }
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
