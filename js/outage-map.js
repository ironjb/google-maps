'use strict';

//OVERRIDE JQUERY VARIABLE
var j;
try {
	j = jQuery.noConflict();
} catch(ex) {
	j = function() {};
}

var currentDate = new Date();

function initialize() {
	// Cause buttons to loose focus after click
	j('.un-focus').click(function (event) {
		this.blur();
	});

	// Map Setup
	var outageMapCanvas = j('#map-canvas');

	var mapSettings = {
		initialZoom: 5
		, minZoom: 4
		, maxZoom: 15
		, maxDistance: 200			// in meters
		, clusterGridSize: 60		// default 60 pixels
		, initialCenter : { lat: 45.482, lng: -104.019 }
	};

	var mapOptions = {
		// center: new google.maps.LatLng(47,-103)
		center: new google.maps.LatLng(mapSettings.initialCenter.lat,mapSettings.initialCenter.lng)
		, zoom: mapSettings.initialZoom
		, minZoom: mapSettings.minZoom
		, maxZoom: mapSettings.maxZoom
		, mapTypeId: google.maps.MapTypeId.TERRAIN
		, mapTypeControl: false
		, panControl: false
		, streetViewControl: false
	};

	var mapType = {
		heatmap: { name: 'heatmap', maxZoom: 14 }
		, cluster: { name: 'cluster', maxZoom: 15 }
	};

	var currentMapType = mapType.cluster;

	var map = new google.maps.Map(outageMapCanvas[0], mapOptions);

	// Map Type Setup
	var markerCluster, markerHeatmap;
	var markerClusterOptions = {
		gridSize: mapSettings.clusterGridSize
		, averageCenter: true
		, imagePath: '/images/outages/m'
	};
	var markerHeatmapOptions = {
		maxWeight: 25		// measured by hours
	};

	// CONTROLS PLACEMENT SETUP
	var topLeftCtrl = j('#mapTopLeftCtrl');
	var bottomLeftCtrl = j('#mapBottomLeftCtrl');
	var bottomRightCtrl = j('#mapBottomRightCtrl');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(topLeftCtrl[0]);
	map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(bottomLeftCtrl[0]);
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(bottomRightCtrl[0]);

	// ADDING SEARCH CONTROL
	(function () {
		var mapSearchOptions = {};
		var searchCtrl = new GoogleMapAutocomplete(map, mapSearchOptions);
	})();

	// ADDING LEGEND CONTROL
	(function () {
		var mapLegendOptions = {};
		var legendCtrl = new MapLegend(map, mapLegendOptions);

		// // Button to open Legend
		// var legendViewButton = j('#legendViewButton');
		// legendCtrl.getCollapseSection().on('show.bs.collapse', function () {
		// 	legendViewButton.hide();
		// });
		// legendCtrl.getCollapseSection().on('hidden.bs.collapse', function () {
		// 	legendViewButton.show();
		// });
	})();

	// ADDING ENLARGE MAP CONTROL
	(function () {
		var enlargeOptions = {};
		var enlargeCtrl = new EnlargeMapControl(enlargeOptions);
	})();

	// MapType Button Controls Setup
	var clusterBtn = j('#clusterTypeButton');
	var heatmapBtn = j('#heatmapTypeButton');
	var clusterLegend = j('#ClusterLegend');
	var heatmapLegend = j('#HeatmapLegend');

	function setCurrentMapTypeButtonActive () {
		if (currentMapType.name === mapType.cluster.name) {
			clusterBtn.addClass('active');
			heatmapBtn.removeClass('active');
			heatmapLegend.hide();
			clusterLegend.show();
		} else {
			heatmapBtn.addClass('active');
			clusterBtn.removeClass('active');
			clusterLegend.hide();
			heatmapLegend.show();
		}
	}
	setCurrentMapTypeButtonActive();

	j.ajax({
		// url: 'JSON/fn-outages-test.json?t=' + Math.round(Math.random() *1000000000),
		// url: 'JSON/fn-outages-test.json?t=' + dayToMinute,
		url: '/JSON/fn-outages-test.json?t=' + currentDate.getTime(),
		contentType: 'application/json',
		dataType: 'json',
		success: function (result) {
			var jsonResult;
			if (typeof result === 'string') {
				try {
					window.console && console.log('parsed JSON string');
					jsonResult = JSON.parse(result);
				} catch (ex) {
					jsonResult = {};
				}
			} else {
				jsonResult = result;
			}

			var filteredOutages = filterOutagesByDistance(jsonResult.outages, mapSettings.maxDistance);
			var markers = setMarkersFromOutages(filteredOutages);
			var heatmapData = setHeatmapDataFromOutages(filteredOutages, markerHeatmapOptions.maxWeight);

			clusterBtn.click(function (event) {
				event.preventDefault();
				currentMapType = mapType.cluster;
				setCurrentMapTypeButtonActive();
				markerHeatmap.setMap(null);
				markerCluster.addMarkers(markers);
				map.setOptions({maxZoom: currentMapType.maxZoom});
			});

			heatmapBtn.click(function (event) {
				event.preventDefault();
				currentMapType = mapType.heatmap;
				setCurrentMapTypeButtonActive();
				markerCluster.clearMarkers();
				setHeatmapRadius(markerHeatmap, map);
				markerHeatmap.setMap(map);
				map.setOptions({maxZoom: currentMapType.maxZoom});
			});

			// Initialize Marker Clusterer
			markerCluster = new MarkerClusterer(map, markers, markerClusterOptions);

			// Initialize Heatmap
			markerHeatmap = new google.maps.visualization.HeatmapLayer({
				data: heatmapData,
				dissipating: true,
				// radius: 25,
				maxIntensity: markerHeatmapOptions.maxWeight,
				map: null
			});
			// var gradient = [
			// 	'rgba(0, 255, 255, 0)',
			// 	'rgba(0, 255, 0, 1)',
			// 	'rgba(255, 255, 0, 1)',
			// 	'rgba(255, 0, 0, 1)'
			// ];
			// markerHeatmap.set('gradient', gradient);

			google.maps.event.addDomListener(map, 'idle', function () {
				if (currentMapType.name === mapType.heatmap.name) {
					setHeatmapRadius(markerHeatmap, map);
				}
			});

			// Initialize radius
			setHeatmapRadius(markerHeatmap, map);
		}
	});
}

function EnlargeMapControl (options) {
	// Default settings
	var settings = {
		enlargeButtonId: '#enlargeMapBtn'
	};

	// Override defaults
	if (options) {
		j.extend(settings, options);
	}

	var enlargeBtn = j(settings.enlargeButtonId);

	if (window.location.hash.toLowerCase() === '#showenlarge') {
		enlargeBtn.show();
	} else {
		enlargeBtn.hide();
	}
}

function GoogleMapAutocomplete (map, options) {
	var geocoder = new google.maps.Geocoder();
	// Default settings
	var settings = {
		addressFormId: '#addressForm'
		, addressId: '#address'
		, geolocationButton: '#useLocation'
		, autocompleteTypes: ['geocode']
	};

	// Override defaults
	if (options) {
		j.extend(settings, options);
	}

	var addressForm = j(settings.addressFormId);
	var addressField = j(settings.addressId);
	var locationBtn = j(settings.geolocationButton);

	// clear the address field on page refresh
	addressField.val('');

	var autocompleteOptions = { types: settings.autocompleteTypes };
	var autocomplete = new google.maps.places.Autocomplete(addressField[0], autocompleteOptions);
	autocomplete.bindTo('bounds', map);

	// autocomplete.addListener('place_changed', function () {
	// 	window.console && console.log('place changed');
	// 	var place = autocomplete.getPlace();
	// 	window.console && console.log(place);
	// });
	addressForm.submit(function (event) {
		event.preventDefault();
		var addressVal = addressField.val();
		// Some Addresses/Zips to search
		//
		// Dickinson, ND, 58601
		//
		// 2160 8th Ave E, Williston, ND, 58801
		//
		// 614 E Hughes St., Glendive, MT, 59330
		//
		// 929 17th St NE, Mandan, ND 58554
		//
		geocoder.geocode({address: addressVal}, function (results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);

				if (results[0].geometry.bounds) {
					map.fitBounds(results[0].geometry.bounds);
				} else {
					map.setZoom(map.maxZoom);
				}
			} else {
				window.console && console.error('Error Finding Address: ', status, results);
			}
		});
	});

	// Try HTML5 geolocation
	if (navigator && navigator.geolocation) {
		locationBtn.click(function (event) {
			event.preventDefault();
			addressField.val('');
			navigator.geolocation.getCurrentPosition(function(position) {
				window.console && console.log(position);
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				addressField.val(pos.lat + ', ' + pos.lng);
				map.setCenter(pos);
				map.setZoom(map.maxZoom);
			}, function() {
				window.console && console.error('geolocation failed');
			});
		});
	} else {
		// Removes button if GeoLocation services not available
		locationBtn.remove();
	}
}

function MapLegend (map, options) {
	// Default settings
	var settings = {
		legendId: '#legend'
		, collapsableSection: '#legendMain'
	};

	// Overrides defaults
	if (options) {
		j.extend(settings, options);
	}

	this._collapseSection = j(settings.collapsableSection);
}

MapLegend.prototype.getCollapseSection = function () {
	return this._collapseSection;
};

function filterOutagesByDistance(outages, distance) {
	var filteredOutagesArray = [];

	// Loops through each point to see if it is within the distance of another point in the array
	for (var i = 0, l = outages.length; i < l; i++) {
		var outage = outages[i];
		var distanceFromNearestPoint = null;
		var currentPoint = new google.maps.LatLng(outage.latitude,outage.longitude);
		var nearbyPoint = false;
		var nearbyPointCount = 0;

		// Loops through the other points in the array and calculates distance from current point
		for (var n = 0, k = outages.length; n < k; n++) {
			var otherOutage = outages[n];
			// Only calculate distance when the points are not the same.
			if (i !== n) {
				var otherPoint = new google.maps.LatLng(otherOutage.latitude,otherOutage.longitude);
				var distanceBetweenPoints = google.maps.geometry.spherical.computeDistanceBetween(currentPoint, otherPoint);

				if (distanceBetweenPoints <= distance) {
					nearbyPoint = true;
					nearbyPointCount++;
				}

				if (distanceFromNearestPoint === null || distanceBetweenPoints < distanceFromNearestPoint) {
					distanceFromNearestPoint = distanceBetweenPoints;
				}
			}
		}

		// Adds outage to filtered List when there is a nearby point
		if (nearbyPoint) {
			outage.distance_from_nearest_point = distanceFromNearestPoint;
			outage.number_of_points_nearby = nearbyPointCount;
			outage.point = currentPoint;
			filteredOutagesArray.push(outage);
		}
	}

	return filteredOutagesArray;
}

function setMarkersFromOutages (outages) {
	var markersArray = [];

	for (var i = 0, l = outages.length; i < l; i++) {
		var outage = outages[i];

		if (!outage.point) {
			outage.point = new google.maps.LatLng(outage.latitude,outage.longitude);
		}

		var marker = new google.maps.Marker({position: outage.point});

		markersArray.push(marker);
	}

	return markersArray;
}

function setHeatmapDataFromOutages (outages, maxWeight) {
	var heatmapDataArray = [];

	for (var i = 0, l = outages.length; i < l; i++) {
		var outage = outages[i];
		var currentOutageHours = (outage.duration_in_hours) ? outage.duration_in_hours : maxWeight;

		if (!outage.point) {
			outage.point = new google.maps.LatLng(outage.latitude,outage.longitude);
		}

		var weightedLocation = {
			location: outage.point,
			weight: currentOutageHours
		};

		heatmapDataArray.push(weightedLocation);
	}

	return heatmapDataArray;
}

function setHeatmapRadius(markerHeatmap, map) {
	var zoom = map.getZoom();
	var radius = zoom*2;
	markerHeatmap.setOptions({radius:radius});
}

google.maps.event.addDomListener(window, 'load', initialize);
