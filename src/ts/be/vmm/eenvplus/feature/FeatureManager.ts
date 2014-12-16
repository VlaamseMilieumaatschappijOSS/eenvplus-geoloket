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
        deselect: () => void;
        discard: FeatureJSONHandler;
        get: (layerBodId:string, key:number) => ng.IPromise<model.FeatureJSON>;
        link: (featureJson:model.FeatureJSON, nodeJsons:model.FeatureJSON[]) => void;
        load: (extent:ol.Extent) => void;
        push: FeatureJSONHandler;
        select: FeatureJSONHandler;
        signal: Signals;
        update: FeatureJSONHandler;
        validate: FeatureJSONHandler;
    }

    export module FeatureManager {
        export var NAME:string = PREFIX + 'FeatureManager';

        factory.$inject = ['$q', 'gaFeatureManager', 'epFeatureStore'];

        function factory(q:ng.IQService, service:FeatureService, store:FeatureStore):FeatureManager {
            var getNode = _.partial(getFeature, toLayerBodId(FeatureType.NODE)),
                deselect = _.partial(select, undefined),
                signals = {
                    create: new signal.TypeSignal<model.FeatureJSON>(),
                    load: new signal.Signal(),
                    remove: new signal.TypeSignal<model.FeatureJSON>(),
                    validate: new signal.TypeSignal<editor.validation.ValidationResult>()
                };

            signals.remove.add(deselect);

            return {
                create: create,
                deselect: deselect,
                discard: discard,
                get: getFeature,
                link: link,
                load: load,
                push: push,
                select: select,
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

            function getFeature(layerBodId:string, key:number):ng.IPromise<model.FeatureJSON> {
                return service
                    .get(layerBodId, key)
                    .then(ensureProperties);
            }

            function create(json:model.FeatureJSON):ng.IPromise<model.FeatureJSON> {
                var deferred = q.defer<model.FeatureJSON>();

                service
                    .create(json)
                    .then(_.partial(getFeature, json.layerBodId))
                    .then(deferred.resolve)
                    .catch(handleError('create', json));

                return deferred.promise;
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
                getConnectedNodesByKeys(json)
                    .then(_.partialRight(_.reject, get('properties.namespaceId')))
                    .then(_.partialRight(_.each, ensureNodeSource))
                    .then(_.partialRight(_.each, updateLink))
                    .catch(handleError('update', json));

                service
                    .update(json)
                    .then(deselect)
                    .catch(handleError('update', json));

                function ensureNodeSource(node:model.FeatureJSON):void {
                    node.properties.namespaceId = json.properties.namespaceId;
                }
            }

            function validate():void {
                service
                    .test()
                    .then(signals.validate.fire)
                    .catch(handleError('validate'));
            }

            function push():void {
                service
                    .push()
                    .then(_.compose(signals.validate.fire, get('validation')))
                    .catch(handleError('push'));
            }

            function discard(json:model.FeatureJSON):void {
                if (json.id) deselect();
                else {
                    getConnectedNodesByKeys(json)
                        .then(_.partialRight(_.each, discard))
                        .catch(handleError('discard', json));

                    service
                        .remove(json)
                        .then(_.partial(signals.remove.fire, json))
                        .catch(handleError('discard', json));
                }
            }

            function getConnectedNodesByKeys(json:model.FeatureJSON):ng.IPromise<model.FeatureJSON[]> {
                return q.all(_(json.properties)
                    .filter(isNodeKey)
                    .map(keyToId)
                    .map(getNode)
                    .value());
            }

            function getId(json:model.FeatureJSON):string {
                return json.id ? json.id.toString() : '#' + json.key;
            }

            function keyToId(key:string):number {
                return parseInt(key.replace('#', ''), 10);
            }

            function isNodeKey(value:string):boolean {
                return typeof value === 'string' && value.charAt(0) === '#';
            }

            function select(json:model.FeatureJSON):void {
                store.current = json;
            }

            function ensureProperties(json:model.FeatureJSON):model.FeatureJSON {
                var type = toType(json.layerBodId);
                json.properties = json.properties || <model.FeatureProperties> {};
                if (type !== FeatureType.NODE) json.properties['statussen'] = []; // FIXME untyped
                return json;
            }

            function handleError(operation:string, data?:model.FeatureJSON):(error:Error) => void {
                return function createErrorHandler(error:Error):void {
                    console.error('Failed to ' + operation + ' feature', data, error);
                };
            }
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
