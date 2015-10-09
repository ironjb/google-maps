'use strict';

//OVERRIDE JQUERY VARIABLE
var j;
try {
	j = jQuery.noConflict();
} catch(ex) {
	j = function() {};
}

var currentDate = new Date();
// new qualifier every 100 seconds
var timeQualifier = Math.round(currentDate.getTime() / 100000);

function initialize() {
	// Cause buttons to loose focus after click
	j('.un-focus').click(function (event) {
		this.blur();
	});

	// Map Setup
	var outageMapCanvas = j('#map-canvas');

	var mapSettings = {
		initialZoom: 6
		, minZoom: 4
		, maxZoom: 15
		, maxDistance: 160			// in meters
		, clusterGridSize: 80		// default 60 pixels
		, initialCenter : { lat: 45.482, lng: -104.019 }
		, refreshInterval: 15		// in minutes
	};

	var markerOptions = {
		markerIcon: {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor: 'red',
			fillOpacity: 0.1,
			scale: 2,
			strokeColor: 'white',
			strokeWeight: 0.5
		}
	}

	var mapOptions = {
		center: new google.maps.LatLng(mapSettings.initialCenter.lat,mapSettings.initialCenter.lng)
		, zoom: mapSettings.initialZoom
		, minZoom: mapSettings.minZoom
		, maxZoom: mapSettings.maxZoom
		, mapTypeId: google.maps.MapTypeId.TERRAIN
		, mapTypeControl: false
		, panControl: false
		, streetViewControl: false
		, zoomControlOptions: { position: google.maps.ControlPosition.TOP_LEFT }
	};

	var mapType = {
		heatmap: { name: 'heatmap', maxZoom: 15 }
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
		maxWeight: 10		// measured by minutes
		, useWeightedLocation: true
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

	/*// TEST POLYGON FOR TOWN OVERLAY
	(function () {
		var countyData = {"id":1740321,"osm_type":"relation","type":"Feature","name":"Williams County","properties":{"name":"Williams County","source":"county_import_v0.1_20080508235446","alt_name":"Williams","boundary":"administrative","wikipedia":"en:Williams County, North Dakota","admin_level":"6","attribution":"USGS 2001 County Boundary","border_type":"county","nist:fips_code":"38105","nist:state_fips":"38"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-102.829117,48.149673],[-102.829681,48.372456],[-102.884712,48.372917],[-102.88711500000001,48.548298],[-102.8860226,48.633094],[-103.126251,48.633633],[-103.148079,48.633686],[-103.169907,48.63373200000001],[-103.277725,48.634872],[-103.40930900000001,48.63359500000001],[-103.538216,48.633167],[-104.04792300000003,48.634013],[-104.04762000000002,48.62701500000001],[-104.04758600000001,48.625644],[-104.04793000000001,48.62019000000001],[-104.048212,48.59905500000001],[-104.04816590000001,48.597613],[-104.04797400000001,48.591606],[-104.04792600000002,48.5831067],[-104.04781100000001,48.56277000000001],[-104.0477919,48.5470261],[-104.04778300000001,48.539737],[-104.04764800000001,48.53148899999999],[-104.047876,48.530798000000004],[-104.04751300000002,48.52591300000001],[-104.04767500000001,48.517852],[-104.04805400000001,48.500025],[-104.04755500000002,48.49414],[-104.047392,48.467085999999995],[-104.04732580000001,48.460046999999996],[-104.04725900000003,48.452940999999996],[-104.04729400000002,48.452529],[-104.04719200000001,48.447250999999994],[-104.04709000000001,48.445903],[-104.04696000000001,48.421065],[-104.04713400000001,48.41105699999999],[-104.04696900000002,48.390675],[-104.04691300000002,48.389433],[-104.04690970000001,48.3892122],[-104.0468808,48.3876129],[-104.04684490000001,48.3855796],[-104.0467543,48.380451099999995],[-104.04665400000002,48.374773],[-104.046371,48.374154],[-104.04636980000001,48.373143999999996],[-104.04633199999999,48.34229],[-104.0462588,48.3209235],[-104.04623470000001,48.313874199999994],[-104.04623430000001,48.313779999999994],[-104.04623350000001,48.313547799999995],[-104.04618430000001,48.29916670000001],[-104.0461351,48.284821099999995],[-104.04609960000002,48.2744531],[-104.04606060000002,48.2630671],[-104.04603900000001,48.256761],[-104.0459413,48.255848],[-104.045861,48.255097],[-104.04564500000001,48.246179000000005],[-104.04572900000001,48.244586],[-104.045692,48.241415],[-104.04557179999999,48.198167000000005],[-104.04556000000001,48.19391300000001],[-104.04542400000001,48.19247300000001],[-104.045498,48.176249],[-104.045399,48.164390000000004],[-104.04521580000001,48.1402861],[-104.0451961,48.137697599999996],[-104.04516070000001,48.13304],[-104.04499470000002,48.1112002],[-104.04433829999999,48.024826499999996],[-104.04415340000003,48.0004984],[-104.04411760000002,47.9971054],[-104.04068000000001,47.99599500000001],[-104.035233,47.99521300000001],[-104.03111300000002,47.993931],[-104.027687,47.993095000000004],[-104.021362,47.98864699999999],[-104.01702100000001,47.983222999999995],[-104.012344,47.971816999999994],[-104.00807999999999,47.967780999999995],[-103.99929000000002,47.967541],[-103.99469000000002,47.969959],[-103.99234,47.976471],[-103.99128700000001,47.982029],[-103.985367,47.984942999999994],[-103.976646,47.98608399999999],[-103.96453100000001,47.98684699999999],[-103.96178400000001,47.985992],[-103.95626800000001,47.98382599999999],[-103.95069900000001,47.980736],[-103.94648000000001,47.977615],[-103.94064300000002,47.969463],[-103.93676,47.95988099999999],[-103.933846,47.955802999999996],[-103.929726,47.95452099999999],[-103.91906000000002,47.95708799999999],[-103.90968300000002,47.958702],[-103.899017,47.961268999999994],[-103.89035,47.963326],[-103.87970699999998,47.966351],[-103.87259699999998,47.97251500000001],[-103.868141,47.977692],[-103.865005,47.98238],[-103.85994699999999,47.988953],[-103.860161,47.993095000000004],[-103.86035199999999,47.99678],[-103.86405900000001,48.003143],[-103.86422700000001,48.006367],[-103.861786,48.01149399999999],[-103.856415,48.012085],[-103.85217999999999,48.011146999999994],[-103.85071599999999,48.011027999999996],[-103.842911,48.009685999999995],[-103.83791400000001,48.006648999999996],[-103.83348099999999,48.003845],[-103.82994799999999,48.000763],[-103.827354,47.995441],[-103.828949,47.989616],[-103.829193,47.980392],[-103.82517999999999,47.97831000000001],[-103.82399,47.978729],[-103.820953,47.979285999999995],[-103.81106600000001,47.984131],[-103.803329,47.99123],[-103.79702800000001,48.000137],[-103.79465500000002,48.006645],[-103.793541,48.01127999999999],[-103.79241900000001,48.015919000000004],[-103.79209900000001,48.022842000000004],[-103.793709,48.027874],[-103.796547,48.030571],[-103.80152900000002,48.035526000000004],[-103.803185,48.04148099999999],[-103.80102500000001,48.05213500000001],[-103.79655500000001,48.057312],[-103.79055000000001,48.058834],[-103.783745,48.058075],[-103.77687799999998,48.055931],[-103.765076,48.049755000000005],[-103.750641,48.045021],[-103.735947,48.048592000000006],[-103.729286,48.05058699999999],[-103.71414200000001,48.058777],[-103.71171600000001,48.064365],[-103.71396600000001,48.068920000000006],[-103.723045,48.074707],[-103.733551,48.08184099999999],[-103.73992900000002,48.08768499999999],[-103.738174,48.093262],[-103.735008,48.097485],[-103.72123,48.10610200000001],[-103.71661400000002,48.108517000000006],[-103.711342,48.11140399999999],[-103.690773,48.119717],[-103.68137399999999,48.121311000000006],[-103.67528499999999,48.121452000000005],[-103.66979199999999,48.119732000000006],[-103.65875199999998,48.11537200000001],[-103.64496600000001,48.110149],[-103.63218699999999,48.111819999999994],[-103.62162000000001,48.11713],[-103.613121,48.12331400000001],[-103.60734599999999,48.129898000000004],[-103.60280599999999,48.134151],[-103.59805300000001,48.133797],[-103.591858,48.131626],[-103.58965300000001,48.127987],[-103.590088,48.12290600000001],[-103.596672,48.119068],[-103.605217,48.113808],[-103.607002,48.108696],[-103.599304,48.103333000000006],[-103.58794400000001,48.092060000000004],[-103.57693499999999,48.088150000000006],[-103.557297,48.087661999999995],[-103.55450400000001,48.085879999999996],[-103.55236799999999,48.083622],[-103.554092,48.077129],[-103.563873,48.06953800000001],[-103.581635,48.059006],[-103.584831,48.055243999999995],[-103.585793,48.046925],[-103.581474,48.04148899999999],[-103.571106,48.036648],[-103.560196,48.034588],[-103.551353,48.033398000000005],[-103.537941,48.035534000000006],[-103.533821,48.034240999999994],[-103.52899199999999,48.03204],[-103.51847799999999,48.02397200000001],[-103.514885,48.019439999999996],[-103.50992600000001,48.01447699999999],[-103.502251,48.009113000000006],[-103.49337,48.007],[-103.48465700000001,48.008568000000004],[-103.47802,48.011016999999995],[-103.46479000000001,48.01728799999999],[-103.452957,48.024456],[-103.44700600000002,48.027348],[-103.443741,48.029720000000005],[-103.43849900000001,48.033516000000006],[-103.4300027,48.0353216],[-103.42645300000001,48.036076],[-103.41826600000002,48.034400999999995],[-103.38473499999999,48.02496],[-103.35725400000001,48.030136000000006],[-103.339821,48.033257],[-103.31852,48.040603999999995],[-103.28817,48.04213300000001],[-103.27537499999998,48.058986999999995],[-103.268761,48.062344],[-103.240372,48.062447],[-103.23574099999999,48.064838],[-103.230507,48.069092000000005],[-103.22736400000001,48.07468399999999],[-103.231071,48.082446999999995],[-103.235184,48.083752000000004],[-103.24269900000002,48.085445],[-103.25022900000002,48.087604999999996],[-103.253105,48.091698],[-103.25256300000001,48.094933000000005],[-103.248108,48.101479],[-103.24226400000002,48.107124],[-103.233047,48.1133],[-103.22781400000001,48.117554],[-103.21860500000001,48.123726000000005],[-103.20668,48.129951000000005],[-103.190567,48.133030000000005],[-103.17244699999998,48.136604],[-103.14612600000001,48.138489],[-103.12805199999998,48.143443999999995],[-103.115257,48.145065],[-103.10853599999999,48.146114000000004],[-103.102463,48.14668699999999],[-103.09361300000002,48.145473],[-103.08880599999999,48.14371500000001],[-103.085281,48.140091],[-103.08567799999999,48.133167],[-103.08345,48.12813900000001],[-103.07737699999998,48.128712000000014],[-103.071419,48.13205000000001],[-103.05588499999999,48.13279300000001],[-103.047752,48.132484],[-103.024818,48.134285],[-103.01061200000001,48.134541],[-102.994438,48.13621500000001],[-102.9823,48.13735200000001],[-102.969498,48.13896200000001],[-102.96065500000002,48.137737],[-102.95246900000001,48.136036000000004],[-102.94286300000002,48.13251500000001],[-102.92637599999999,48.125889],[-102.91952500000002,48.123703000000006],[-102.906677,48.123924],[-102.899277,48.124973000000004],[-102.88598599999999,48.131653],[-102.88002,48.134983],[-102.87197099999999,48.136963],[-102.864502,48.136166],[-102.85973399999999,48.135326000000006],[-102.85289799999998,48.133598000000006],[-102.84400900000001,48.130981],[-102.83714300000001,48.12833000000001],[-102.82891799999999,48.125240000000005],[-102.829117,48.149673]]]]}};
		var townData = {"id":181434,"osm_type":"relation","type":"Feature","name":"Alamo","properties":{"name":"Alamo","is_in":"USA, North Dakota","place":"city","source":"TIGER/Line® 2008 Place Shapefiles (http://www.census.gov/geo/www/tiger/)","boundary":"administrative","tiger:CPI":"N","wikipedia":"en:Alamo, North Dakota","tiger:LSAD":"25","tiger:NAME":"Alamo","admin_level":"8","border_type":"city","is_in:state":"North Dakota","tiger:MTFCC":"G4110","is_in:country":"USA","tiger:CLASSFP":"C5","tiger:PCICBSA":"N","tiger:PLACEFP":"00940","tiger:PLACENS":"01035902","tiger:PLCIDFP":"3800940","tiger:STATEFP":"38","tiger:FUNCSTAT":"A","tiger:NAMELSAD":"Alamo city","tiger:PCINECTA":"N","is_in:iso_3166_2":"US:ND","is_in:state_code":"ND","is_in:country_code":"US"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-103.461307,48.590069],[-103.46582500000001,48.590082],[-103.47216900000001,48.59011900000001],[-103.472166,48.589148],[-103.472189,48.585187],[-103.473632,48.585235000000004],[-103.473595,48.583579],[-103.475039,48.583597],[-103.47504599999999,48.581935],[-103.475065,48.581152],[-103.475059,48.575703000000004],[-103.474496,48.575692000000004],[-103.47393199999999,48.575682],[-103.472162,48.575632000000006],[-103.461588,48.575587],[-103.461578,48.575928000000005],[-103.46157300000002,48.576263999999995],[-103.46153100000001,48.578754],[-103.46146300000002,48.58259],[-103.461442,48.58375],[-103.46140500000001,48.585868],[-103.461391,48.586648999999994],[-103.461307,48.590069]]]]}};
		var coords = townData.geometry.coordinates;
		for (var i = coords.length - 1; i >= 0; i--) {
			var multiPoly = coords[i];
			for (var k = multiPoly.length - 1; k >= 0; k--) {
				var poly = multiPoly[k];
				var latLngArray = [];
				for (var n = poly.length - 1; n >= 0; n--) {
					var latLngObj = { lat: poly[n][1], lng: poly[n][0] };
					latLngArray.unshift(latLngObj);
				}
				// window.console && console.log(latLngArray);
				// var triangleCoords = [
				// 	{lat: 45.482, lng: -104.019},
				// 	{lat: 49.482, lng: -103.019},
				// 	{lat: 40.482, lng: -101.019},
				// 	{lat: 45.482, lng: -104.019}
				// ];
				var testTown = new google.maps.Polygon({
					paths: latLngArray,
					strokeColor: '#FF0000',
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: '#FF0000',
					fillOpacity: 0.35
				});
				// testTown.setMap(map);

				// Get center of polygon, place marker there with info window
				var bounds = new google.maps.LatLngBounds();

				for (var m = latLngArray.length - 1; m >= 0; m--) {
					bounds.extend(new google.maps.LatLng(latLngArray[m].lat, latLngArray[m].lng));
				}

				var markerIcon = {
					url: '/images/outages/warning-triangle-sm.png'
					, scaledSize: new google.maps.Size(23, 20)
					, origin: new google.maps.Point(0, 0)
					, anchor: new google.maps.Point(11, 10)
				};
				var marker = new google.maps.Marker({
					position: bounds.getCenter()
					, map: map
					, title: 'title'
					, icon: markerIcon
				});

				var infowindow = new google.maps.InfoWindow({
					content: 'Outages reported within <b>' + townData.name + '</b> area<br />(or some other message... can be text or html)'
				});

				marker.addListener('click', function () {
					map.setZoom(currentMapType.maxZoom - 3);
					map.setCenter(bounds.getCenter());
					infowindow.open(map, marker);
				});
			}
		}
	})();*/

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

	// var pointA = new google.maps.LatLng(46.843564163471,-100.786411047359);
	// var pointB = new google.maps.LatLng(46.843564163471,-100.788862692348);
	// var testDistance = google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
	// window.console && console.log(testDistance);

	// Initial retrieval of data
	getData(mapSettings, markerOptions, markerHeatmapOptions, function (markers, heatmapData) {
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
		markerCluster.setCalculator(clusterCalculator);

		// Initialize Heatmap
		markerHeatmap = new google.maps.visualization.HeatmapLayer({
			data: heatmapData,
			dissipating: true,
			// radius: 25,
			maxIntensity: markerHeatmapOptions.maxWeight,
			map: null
		});

		google.maps.event.addDomListener(map, 'idle', function () {
			if (currentMapType.name === mapType.heatmap.name) {
				setHeatmapRadius(markerHeatmap, map);
			}
		});

		// Initialize radius
		setHeatmapRadius(markerHeatmap, map);
	});

	var refreshData = function () {
		return getData(mapSettings, markerOptions, markerHeatmapOptions, function (markers, heatmapData) {
			if (currentMapType.name === mapType.heatmap.name) {
				// window.console && console.log('heatmap set data');
				markerHeatmap.setData(heatmapData);
			} else {
				// window.console && console.log('markerCluster clear then add markers');
				markerCluster.clearMarkers();
				markerCluster.addMarkers(markers);
			}
		});
	};
	setInterval(refreshData, 1000 * 60 * mapSettings.refreshInterval);
}

function getData (mapSettings, markerOptions, markerHeatmapOptions, callbackFunction) {
	j.ajax({
		url: '/JSON/mvc-outage-map-get.json?t=' + timeQualifier
		// url: '/mvc/outage-map/get/?tq=' + timeQualifier
		, contentType: 'application/json'
		, dataType: 'json'
		, success: function (result) {
			var jsonResult;
			if (typeof result === 'string') {
				try {
					jsonResult = JSON.parse(result);
				} catch (ex) {
					jsonResult = {};
				}
			} else {
				jsonResult = result;
			}

			var filteredOutages = filterOutagesByDistance(jsonResult, mapSettings.maxDistance);
			var markers = setMarkersFromOutages(filteredOutages, markerOptions);
			var heatmapData = setHeatmapDataFromOutages(filteredOutages, markerHeatmapOptions.maxWeight, markerHeatmapOptions.useWeightedLocation);

			if (callbackFunction) {
				callbackFunction(markers, heatmapData);
			}
		}
		, error: function (jqXHR, status, error) {
			window.console && console.log('Error: ', status, error, jqXHR);
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

function setMarkersFromOutages (outages, options) {
	var markersArray = [];
	var settings = {};

	// Override defaults
	if (options) {
		j.extend(settings, options);
	}

	for (var i = 0, l = outages.length; i < l; i++) {
		var outage = outages[i];

		if (!outage.point) {
			outage.point = new google.maps.LatLng(outage.latitude,outage.longitude);
		}

		var marker = new google.maps.Marker({position: outage.point});

		if (settings.markerIcon) {
			marker.setIcon(settings.markerIcon);
		}

		markersArray.push(marker);
	}

	return markersArray;
}

function setHeatmapDataFromOutages (outages, maxWeight, useWeightedLocation) {
	var heatmapDataArray = [];

	for (var i = 0, l = outages.length; i < l; i++) {
		var outage = outages[i];
		var currentOutageMinutes = (outage.outageHours * 60 < maxWeight) ? outage.outageHours * 60 : maxWeight;

		if (!outage.point) {
			outage.point = new google.maps.LatLng(outage.latitude,outage.longitude);
		}

		var weightedLocation = {
			location: outage.point
			, weight: currentOutageMinutes
		};
		if (useWeightedLocation) {
			heatmapDataArray.push(weightedLocation);
		} else {
			heatmapDataArray.push(outage.point);
		}
	}

	return heatmapDataArray;
}

function setHeatmapRadius(markerHeatmap, map) {
	var zoom = map.getZoom();
	var radius = zoom*2;
	markerHeatmap.setOptions({radius:radius});
}

function clusterCalculator (markers, numStyles) {
	var index = 0;
	var count = markers.length;
	var dv = count;

	if (count >= 1000) {
		index = 5;
	} else if (count >= 500) {
		index = 4;
	} else if (count >= 100) {
		index = 3;
	} else if (count >= 10) {
		index = 2;
	} else {
		index = 1;
	}

	index = Math.min(index, numStyles);
	return {
		text: count,
		index: index
	};
};

google.maps.event.addDomListener(window, 'load', initialize);
