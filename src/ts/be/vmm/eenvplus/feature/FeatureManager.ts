///ts:ref=Module
/// <reference path="../Module.ts"/> ///ts:ref:generated

import signal = Trasys.Signals;

module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureJSONHandler {
        (json:model.FeatureJSON):void;
    }

    export interface Signals {
        create:signal.ITypeSignal<feature.model.FeatureJSON>;
        load:signal.ISignal;
        remove:signal.ITypeSignal<feature.model.FeatureJSON>;
    }

    export interface FeatureManager {
        create: FeatureJSONHandler;
        discard: FeatureJSONHandler;
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
                    create: new signal.TypeSignal<feature.model.FeatureJSON>(),
                    load: new signal.Signal(),
                    remove: new signal.TypeSignal<feature.model.FeatureJSON>()
                };

            signals.remove.add(deselect);

            return {
                create: create,
                discard: discard,
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

            function create(json:feature.model.FeatureJSON):ng.IPromise<feature.model.FeatureJSON> {
                var deferred = q.defer<feature.model.FeatureJSON>();

                service
                    .create(json)
                    .then(getSavedData)
                    .catch(handleError('create', json));

                return deferred.promise;

                function getSavedData(key:number):void {
                    service
                        .get(json.layerBodId, key)
                        .then(deferred.resolve)
                        .catch(handleError('create', json));
                }
            }

            function update(json:feature.model.FeatureJSON):void {
                service
                    .update(json)
                    .then(deselect)
                    .catch(handleError('update', json));
            }

            function validate():void {
                service
                    .test()
                    .then(showMessages)
                    .catch(handleError('validate'));
            }

            function push():void {
                service
                    .push()
                    .then(showMessages)
                    .catch(handleError('push'));
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

            function showMessages(messages:any):void {
                console.log(messages);
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
