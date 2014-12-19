module be.vmm.eenvplus.feature {
    'use strict';

    export interface FeatureService {
        clear():ng.IPromise<void>;
        create(feature:ol.format.GeoJSONFeature):ng.IPromise<number>;
        dirty():ng.IPromise<boolean>;
        get(layerBodId:string, key:number):ng.IPromise<ol.format.GeoJSONFeature>;
        getById(layerBodId:string, id:number):ng.IPromise<ol.format.GeoJSONFeature>;
        pull(bbox?:ol.Extent):ng.IPromise<void>;
        push():ng.IPromise<any>;
        query(layerBodId:string, extent:ol.Extent):ng.IPromise<ol.format.GeoJSONFeature[]>;
        query(layerBodId:string, filter:filterFeature):ng.IPromise<ol.format.GeoJSONFeature[]>;
        query(layerBodId:string, extent:ol.Extent, filter:filterFeature):ng.IPromise<ol.format.GeoJSONFeature[]>;
        remove(feature:ol.format.GeoJSONFeature):ng.IPromise<ol.format.GeoJSONFeature>;
        test():ng.IPromise<any>;
        update(feature:ol.format.GeoJSONFeature):ng.IPromise<void>;
    }

    export interface filterFeature {
        (json:feature.model.FeatureJSON):boolean;
    }

    export module FeatureService {
        export var NAME = PREFIX + 'FeatureService';

        var VERSION:number = 3,
            apiUrl:string = 'http://127.0.0.1:8080/eenvplus-sdi-services',
            indexedDB = window.indexedDB || window['mozIndexedDB'] || window['webkitIndexedDB'] || window.msIndexedDB,
            IDBTransaction = window['IDBTransaction'] || window['webkitIDBTransaction'] || window['msIDBTransaction'],
            IDBKeyRange = window['IDBKeyRange'] || window['webkitIDBKeyRange'] || window['msIDBKeyRange'];

        factory.$inject = ['$http', '$q', 'typeModelMap'];

        function factory(http, q, typeModelMap):FeatureService {
            var types = typeModelMap,
                db = openDB();

            return <any>{
                clear: clear,
                create: create,
                dirty: dirty,
                get: get,
                getById: getById,
                pull: pull,
                push: push,
                query: query,
                remove: remove,
                test: test,
                update: update
            };

            function openDB() {
                var d = q.defer(),
                    openRequest = indexedDB.open('Feature', VERSION);

                openRequest.onupgradeneeded = (event:IDBVersionChangeEvent) => {
                    var db = (<IDBRequest> event.target).result;
                    types.forEach((type) => {
                        if (!db.objectStoreNames.contains(type)) {
                            var objectStore = db.createObjectStore(type, {keyPath: 'key', autoIncrement: true});
                            objectStore.createIndex('id', 'id', {unique: true});
                            objectStore.createIndex('action', 'action', {unique: false});
                        }
                    });
                };
                openRequest.onsuccess = (event) => {
                    d.resolve((<IDBRequest> event.target).result);
                };
                openRequest.onerror = () => {
                    d.reject('Could not open local storage.');
                };

                return d.promise;
            }

            function clear() {
                var d = q.defer();

                db.then((db) => {
                    var transaction = db.transaction(types, "readwrite"),
                        i = 0;

                    var next = () => {
                        if (i < types.length) {
                            var type = types[i++],
                                objectStore = transaction.objectStore(type),
                                request = objectStore.clear();

                            request.onsuccess = next;
                            request.onerror = () => {
                                d.reject("Could not clear features in local storage.");
                            };
                        } else {
                            d.resolve();
                        }
                    };
                    next();
                });

                return d.promise;
            }

            function create(feature) {
                var d = q.defer();
                var type = getType(feature.layerBodId);

                db.then((db) => {
                    var objectStore = db.transaction(type, "readwrite").objectStore(type);

                    addBbox(feature);
                    feature.action = "create";

                    var request = objectStore.add(feature);
                    request.onsuccess = (event) => {
                        d.resolve(event.target.result);
                    };
                    request.onerror = () => {
                        d.reject("Could not add feature to local storage.");
                    };
                });

                return d.promise;
            }

            function dirty() {
                var d = q.defer();

                db.then((db) => {
                    var transaction = db.transaction(types, "readwrite"),
                        i = 0;

                    var next = () => {
                        if (i < types.length) {
                            var type = types[i++],
                                objectStore = transaction.objectStore(type),
                                index = objectStore.index("action"),
                                request = index.getKey(IDBKeyRange.lowerBound("0"));

                            request.onsuccess = (event) => {
                                if (event.target.result != null) {
                                    d.resolve(true);
                                } else {
                                    next();
                                }
                            };
                            request.onerror = () => {
                                d.reject("Could not check for modified features in local storage.");
                            };
                        } else {
                            d.resolve(false);
                        }
                    };
                    next();
                });

                return d.promise;
            }

            function get(layerBodId, key) {
                var d = q.defer(),
                    type = getType(layerBodId);

                db.then((db) => {
                    var objectStore = db.transaction(type).objectStore(type),
                        request = objectStore.get(key);

                    request.onsuccess = (event) => {
                        var feature = (<IDBRequest> event.target).result;
                        if (feature && feature.action != "delete") {
                            d.resolve(feature);
                        } else {
                            d.resolve(null);
                        }
                    };
                    request.onerror = () => {
                        d.reject("Could not get feature from local storage.");
                    };
                });

                return d.promise;
            }

            function getById(layerBodId, id) {
                var d = q.defer(),
                    type = getType(layerBodId);

                db.then((db) => {
                    var objectStore = db.transaction(type).objectStore(type),
                        index = objectStore.index("id"),
                        request = index.get(id);

                    request.onsuccess = (event) => {
                        var feature = (<IDBRequest> event.target).result;
                        if (feature && feature.action != "delete") {
                            d.resolve(feature);
                        } else {
                            d.resolve(null);
                        }
                    };
                    request.onerror = () => {
                        d.reject("Could not get feature from local storage.");
                    };
                });

                return d.promise;
            }

            function merge(features) {
                var d = q.defer();

                db.then((db) => {
                    var transaction = db.transaction(types, "readwrite"),
                        i = 0;

                    var next = () => {
                        if (i < features.length) {
                            var feature = features[i++],
                                type = getType(feature.layerBodId),
                                objectStore = transaction.objectStore(type),
                                index = objectStore.index("id"),
                                request = index.getKey(feature.id);

                            request.onsuccess = (event) => {
                                addBbox(feature);

                                var key = event.target.result,
                                    request;

                                if (key) {
                                    feature.key = key;
                                    request = objectStore.put(feature);

                                } else {
                                    request = objectStore.add(feature);
                                }

                                request.onsuccess = next;
                                request.onerror = () => {
                                    d.reject("Could not merge features in local storage.");
                                };
                            };
                            request.onerror = () => {
                                d.reject("Could not merge features in local storage.");
                            };
                        } else {
                            d.resolve();
                        }
                    };
                    next();
                });

                return d.promise;
            }

            function pull(bbox) {
                var d = q.defer(),
                    url = apiUrl + "/rest/services/api/MapServer/pull?types=" + types.join(",");

                if (bbox)
                    url += "&extent=" + bbox.join(",");

                http.get(url).success((features) => {
                    merge(features).then(d.resolve, d.reject);
                }).error(() => {
                    d.reject("Could not pull features.");
                });

                return d.promise;
            }

            function push() {
                var d = q.defer();

                modifications().then((results) => {
                    http
                        .post(apiUrl + "/rest/services/api/MapServer/push", results)
                        .success((report) => {
                            if (report.completed) {
                                var results = report.results;

                                var transaction = db.transaction(types, "readwrite");
                                var i = 0;
                                var next = function () {
                                    if (i < results.length) {
                                        var result = results[i++];
                                        var type = getType(result.layerBodId);

                                        var objectStore = transaction.objectStore(type);

                                        var key = result.key;
                                        var request;
                                        if (result.action == "create" || result.action == "update") {
                                            var feature = result.feature;
                                            feature.key = key;
                                            addBbox(feature);
                                            request = objectStore.put(feature);
                                        } else if (result.action == "delete") {
                                            request = objectStore.delete(key);
                                        }
                                        if (request) {
                                            request.onsuccess = next;
                                            request.onerror = function (event) {
                                                d.reject("Could not merge modified features in local storage.");
                                            };
                                        } else {
                                            next();
                                        }
                                    } else {
                                        d.resolve(report);
                                    }
                                };
                                next();
                            } else {
                                d.resolve(report);
                            }
                        }).error(function () {
                            d.reject("Could not push features.");
                        });
                }, d.reject);

                return d.promise;
            }

            function query(layerBodId, extent, filter) {
                var d = q.defer(),
                    type = getType(layerBodId);

                if (typeof extent === 'function') {
                    filter = extent;
                    extent = undefined;
                }

                db.then((db) => {
                    var results = [],
                        objectStore = db.transaction(type).objectStore(type),
                        request = objectStore.openCursor();

                    request.onsuccess = (event) => {
                        var cursor = (<IDBRequest> event.target).result;
                        if (cursor) {
                            var feature = cursor.value;
                            if (meetsConditions(feature)) {
                                results.push(cursor.value);
                            }
                            cursor.continue();
                        } else {
                            d.resolve(results);
                        }
                    };
                    request.onerror = function () {
                        d.reject("Could not get features from local storage.");
                    };
                });

                function meetsConditions(feature) {
                    return feature &&
                        feature.action != "delete" &&
                        (!extent || ol.extent.intersects(extent, feature.geometry.bbox)) &&
                        (!filter || filter(feature));
                }

                return d.promise;
            }

            function remove(feature) {
                var d = q.defer(),
                    type = getType(feature.layerBodId);

                db.then((db) => {
                    var objectStore = db.transaction(type, "readwrite").objectStore(type),
                        request;

                    if (feature.id) {
                        feature.action = "delete";
                        request = objectStore.put(feature);
                    } else {
                        request = objectStore.delete(feature.key);
                    }

                    request.onsuccess = _.partial(d.resolve, feature);
                    request.onerror = () => {
                        d.reject("Could not delete feature in local storage.");
                    };
                });

                return d.promise;
            }

            function test() {
                var d = q.defer();

                modifications().then(function (results) {
                    http.post(apiUrl + "/rest/services/api/MapServer/test", results).success(function (report) {
                        d.resolve(report);
                    }).error(function () {
                        d.reject("Could not test features.");
                    });
                }, d.reject);

                return d.promise;
            }

            function update(feature) {
                var d = q.defer(),
                    type = getType(feature.layerBodId);

                db.then((db) => {
                    var objectStore = db.transaction(type, "readwrite").objectStore(type);

                    addBbox(feature);
                    feature.action = feature.id ? "update" : "create";

                    var request = objectStore.put(feature);
                    request.onsuccess = d.resolve;
                    request.onerror = () => {
                        d.reject("Could not update feature in local storage.");
                    };
                });

                return d.promise;
            }

            /** @private */
            function modifications() {
                var d = q.defer();

                db.then((db) => {
                    var results = [],
                        transaction = db.transaction(types, "readwrite"),
                        i = 0;

                    var next = () => {
                        if (i < types.length) {
                            var type = types[i++],
                                objectStore = transaction.objectStore(type),
                                index = objectStore.index("action"),
                                request = index.openCursor(IDBKeyRange.lowerBound("0"));

                            request.onsuccess = (event) => {
                                var cursor = event.target.result;
                                if (cursor) {
                                    var feature = cursor.value;
                                    if (feature) {
                                        results.push(cursor.value);
                                        cursor.continue();
                                    }
                                } else {
                                    next();
                                }
                            };
                            request.onerror = () => {
                                d.reject("Could not get modified features from local storage.");
                            };
                        } else {
                            d.resolve(results);
                        }
                    };
                    next();
                });

                return d.promise;
            }
        }

        /** @private */
        function getType(layerBodId) {
            var index = layerBodId.indexOf(':');
            if (index > 0)
                return layerBodId.substring(index + 1);

            return layerBodId;
        }

        /** @private */
        function addBbox(feature) {
            if (!feature.geometry.bbox) {
                var geometry = new ol.format.GeoJSON().readGeometry(feature.geometry);
                feature.geometry.bbox = geometry.getExtent();
            }
        }

        angular
            .module(MODULE)
            .factory(NAME, factory);
    }

}
