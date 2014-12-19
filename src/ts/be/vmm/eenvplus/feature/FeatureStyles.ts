
module be.vmm.eenvplus.feature {
    'use strict';
    
    var STATUSSEN = ["projected", "disused", "functional"];
	var MODES = {"default": "rgba(255,255,255,0.6)", "selected": "rgba(130,130,255,0.6)", "modified": "rgba(255,120,135,0.6)"};
	
	var RIOOLAPPURTENANCE_TYPES = ["zuiveringsinstallatie", "overstort", "aansluiting", "catchBasin", "cabinet", "pump", "tideGate", "node", "node", "node", "node", "node", "node", "node" ];

	
	var KOPPELPUNT_HALO_STYLES = (function() {
		var stylesByMode = {};
		
		for(var i in MODES) {
			stylesByMode[i] = new ol.style.Style({
	            image: new ol.style.Circle({
	                radius: 7,
	                fill: new ol.style.Fill({
	                    color: MODES[i]
	                })
	            })
	        });
		}
		
		return stylesByMode;
	})();
	
	var KOPPELPUNT_STYLE = new ol.style.Style({
		image: new ol.style.Circle({
			radius: 4,
			fill: new ol.style.Fill({
				color: '#8C510A'
			})
		})
	});
	
	var RIOOLLINK_HALO_STYLES = (function() {
		var stylesByMode = {};
		
		for(var i in MODES) {
			stylesByMode[i] = new ol.style.Style({
				stroke: new ol.style.Stroke({
		            color: MODES[i],
		            width: 6
		        })
	        });
		}
		
		return stylesByMode;
	})();
	
	var RIOOLLINK_STYLES = {
			
		0: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: '#8C510A',
				width: 2,
				lineDash: [2, 4]
			})
		}),
		1: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: '#8C510A',
				width: 2,
				lineDash: [5, 2, 2, 2]
			})
		}),
		2: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: '#8C510A',
				width: 2
			})
		})
	};
	
	var RIOOLAPPURTENANCE_HALO_STYLES = (function() {
		var stylesByMode = {};
		
		for(var i in MODES) {
			stylesByMode[i] = new ol.style.Style({
	            image: new ol.style.Circle({
	                radius: 11,
	                fill: new ol.style.Fill({
	                    color: MODES[i]
	                })
	            })
	        });
		}
		
		return stylesByMode;
	})();
	
	var RIOOLAPPURTENANCE_STYLES = (function() {
		
		var stylesByStatus = {};

		var size = [80, 80];
		
		for(var i = 0; i < STATUSSEN.length; i ++) {
			var status = STATUSSEN[i];
			
			var stylesByType = {};
			stylesByStatus[i] = stylesByType;
			
			for(var j = 0; j < RIOOLAPPURTENANCE_TYPES.length; j ++) {
				var type = RIOOLAPPURTENANCE_TYPES[j];
				
				if(type) {
					stylesByType[j] = new ol.style.Style({
						image: new ol.style.Icon({
							src: 'http://o-www.vmm.be/bestanden/geoloketdata/svg/sewer_' + type + (status != "functional" ? '_' + status : '') + '.svg',
						    scale: 0.1
						})
					});
				}
			}
		}
		
		return stylesByStatus;
	})();
	
	var getStatus = function(feature) {
		
		var now = new Date().getTime();
		
		var statussen = feature.getProperties().statussen;
		
		if (statussen) {
			for(var i = 0; i < statussen.length; i ++) {
				var status = statussen[i];
				if((!status.geldigVanaf || status.geldigVanaf < now)
						&& (!status.geldigTot || status.geldigTot > now))
					return status.statusId;
			}
		}
		
		return 2;
	}
	
	export function createStyle(type, mode) {
		switch (type) {
		case 0 /*SEWER*/:
			return function(feature, resolution) {
				return [ RIOOLLINK_HALO_STYLES[mode], RIOOLLINK_STYLES[getStatus(feature)] ];
			};
		case 1 /*APPURTENANCE*/:
			return function(feature, resolution) {
				return [ RIOOLAPPURTENANCE_HALO_STYLES[mode], RIOOLAPPURTENANCE_STYLES[getStatus(feature)][feature.getProperties().rioolAppurtenanceTypeId] ];
			};
		case 2 /*NODE*/:
			return function(feature, resolution) {
				return [ KOPPELPUNT_HALO_STYLES[mode], KOPPELPUNT_STYLE ];;
			};
		}
	}
}
