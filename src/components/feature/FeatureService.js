(function() {
	goog.provide('ga_feature_service');

	var module = angular.module('ga_feature_service', []);
	
	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	
	module.factory('gaGeoHashEncoder', function() {
		
		var BASE_32 = ['0', '1', '2', '3', '4', '5', '6',
		      '7', '8', '9', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm', 'n',
		      'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		var BITS = [16, 8, 4, 2, 1];
		
		return {
			encodePoint : function(bbox, point, precision) {
				  
				var x = point[0];
				var y = point[1];
				
				var ix = [ bbox[0], bbox[2] ];
				var iy = [ bbox[1], bbox[3] ];
				
				var hash = '';
				var even = true;
				
				var bit = 0;
				var ch = 0;

			    while (hash.length < precision) {
			    	if (even) {
			    		var mx = (ix[0] + ix[1]) / 2.0;
			    		if (x > mx) {
			    			ch |= BITS[bit];
			    			ix[0] = mx;
			    		} else {
			    			ix[1] = mx;
			    		}
			    	} else {
			    		var my = (iy[0] + iy[1]) / 2.0;
			    		if (y > my) {
			    			ch |= BITS[bit];
			    			iy[0] = my;
			    		} else {
			    			iy[1] = my;
			    		}
			    	}

			    	even = !even;

			    	if (bit < 4) {
			    		bit++;
			    	} else {
			    		hash += BASE_32[ch];
			    		bit = 0;
			    		ch = 0;
			    	}
			    }

			    return hash;
			}
		};
	});
	
	module.factory('gaFeatureManager', function($http, $q) {

		var db = (function() {
			var d = $q.defer();

			var openRequest = indexedDB.open("Feature", 1);
			openRequest.onupgradeneeded = function(event) {
				  var db = event.target.result;
				  if(!db.objectStoreNames.contains("Feature")) {
					  var objectStore = db.createObjectStore("Feature", { keyPath: "id" });
					  objectStore.createIndex("featureId", "featureId", { unique: true });
					  objectStore.createIndex("modified", "modified", { unique: false });
					  objectStore.createIndex("deleted", "deleted", { unique: false });
				  }
			};
			openRequest.onsuccess = function(event) {
				d.resolve(event.target.result);
			};
			openRequest.onerror = function(event) {
				d.reject("Local storage error.");
			};
			
			return d.promise;
		})();
		
		var featureManager = {
			"apiUrl": "http://127.0.0.1:8080/eenvplus-sdi-services",
		
			"query" : function(layerBodId, extent) {
				var d = $q.defer();
				
				db.then(function(db) {
					var objectStore = db.transaction("Feature").objectStore("Feature");
					
					var results = [];
					
					objectStore.openCursor().onsuccess = function(event) {
						var cursor = event.target.result;
						if (cursor) {
							var feature = cursor.value;
							if (feature) {
								if(ol.extent.intersects(extent, feature.geometry.bbox))
									results.push(cursor.value);
								cursor.continue();
							}
						} else {
							d.resolve(results);
						}
					}
				});
				
				return d.promise;
			},
			"get" : function(layerBodId, featureId) {
				var d = $q.defer();
				
				db.then(function(db) {
					var objectStore = db.transaction("Feature").objectStore("Feature");
					var index = objectStore.index("featureId");
					index.get(featureId).onsuccess = function(event) {
						d.resolve(event.target.result);
					};
				});
				
				return d.promise;
			},
			"create" : function(feature) {
				var d = $q.defer();
				
				db.then(function(db) {
					feature.modified = true;
					var objectStore = db.transaction("Feature", "readwrite").objectStore("Feature");
					objectStore.add(feature).onsuccess = function() {
						d.resolve();
					};
				});
				
				return d.promise;
			},
			"update" : function(feature) {
				var d = $q.defer();
				
				db.then(function(db) {
					feature.modified = true;
					var objectStore = db.transaction("Feature", "readwrite").objectStore("Feature");
					objectStore.put(feature).onsuccess = function() {
						d.resolve();
					};
				});
				
				return d.promise;
			},
			"remove" : function(feature) {
				var d = $q.defer();
				
				db.then(function(db) {
					feature.modified = true;
					feature.deleted = true;
					var objectStore = db.transaction("Feature", "readwrite").objectStore("Feature");
					objectStore.put(feature).onsuccess = function() {
						d.resolve();
					};
				});
				
				return d.promise;
			},
			"clear" : function() {
				var d = $q.defer();
				
				db.then(function(db) {
					var objectStore = db.transaction("Feature", "readwrite").objectStore("Feature");
					objectStore.clear().onsuccess = function() {
						d.resolve();
					};
				});
				
				return d.promise;
			},
			"dirty" : function() {
				var d = $q.defer();
				
				db.then(function(db) {
					var objectStore = db.transaction("Feature").objectStore("Feature");
					var index = objectStore.index("modified");
					index.getKey(true).onsuccess = function(event) {
						d.resolve(event.target.result != null);
					};
				});
				
				return d.promise;
			},
			"pull" : function(bbox) {
				var d = $q.defer();
				
				db.then(function(db) {
					var url = featureManager.apiUrl + "/rest/services/api/MapServer/pull";
					if(bbox)
						url += "?extent=" + bbox[0] + "," + bbox[1] + "," + bbox[2] + "," + bbox[3];
				
					$http.get(url).success(function(features) {
						var objectStore = db.transaction("Feature", "readwrite").objectStore("Feature");
						var i = 0;
						var addNext = function() {
							if (i < features.length) {
								var feature = features[i++];
								if(!feature.geometry.bbox){
									var geometry = new ol.format.GeoJSON().readGeometry(feature.geometry);
									var extent = geometry.getExtent();
									feature.geometry.bbox = extent;
								}
								objectStore.put(feature).onsuccess = addNext;
							} else {
								d.resolve();
							}
						} 
						addNext();
					});
				});
				
				return d.promise;
			},
			"push" : function() {
				var d = $q.defer();
				
				db.then(function(db) {
					var objectStore = db.transaction("Feature").objectStore("Feature");
					
					var results = [];
					
					var index = objectStore.index("modified"); 
					index.openCursor(true).onsuccess = function(event) {
						var cursor = event.target.result;
						if (cursor) {
							var feature = cursor.value;
							if (feature) {
								results.push(cursor.value);
								cursor.continue();
							}
						} else {
							$http.post(featureManager.apiUrl + "/rest/services/api/MapServer/push", results).success(function(messages) {
								d.resolve(messages);
							});
						}
					}
				});
				
				return d.promise;
			},
			"test" : function() {
				var d = $q.defer();
				
				db.then(function(db) {
					var objectStore = db.transaction("Feature").objectStore("Feature");
					
					var results = [];
					
					var index = objectStore.index("modified"); 
					index.openCursor(true).onsuccess = function(event) {
						var cursor = event.target.result;
						if (cursor) {
							var feature = cursor.value;
							if (feature) {
								results.push(cursor.value);
								cursor.continue();
							}
						} else {
							$http.post(featureManager.apiUrl + "/rest/services/api/MapServer/test", results).success(function(messages) {
								d.resolve(messages);
							});
						}
					}
				});
				
				return d.promise;
			}
		};
		
		return featureManager;
	});
})();