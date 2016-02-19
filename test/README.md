#Google Maps Tutorial


###May help with showing outage:
[Google Maps API: Heatmapplayer](https://developers.google.com/maps/documentation/javascript/heatmaplayer)  
[Google Maps API: Layer-Heatmap](https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap)  
[Marker Clusterer](https://github.com/googlemaps/js-marker-clusterer)  

###Spherical documentation
[Google Maps API: Spherical](https://developers.google.com/maps/documentation/javascript/reference#spherical)  

###Handling many markers
[Handling Large Amounts of Markers](http://www.svennerberg.com/2009/01/handling-large-amounts-of-markers-in-google-maps/)  
[Marker Clusterer](https://github.com/googlemaps/js-marker-clusterer)  

###Geocode
[Google Maps API: Geocodeing - simple](https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple)  
[Google Maps API: Geocoding - intro](https://developers.google.com/maps/documentation/geocoding/intro)  

###Examples
[Google Maps API: Examples](https://developers.google.com/maps/documentation/javascript/examples/)  

###Tutorials
~~https://developers.google.com/maps/tutorials/~~

###Current Tutorial location:
~~https://developers.google.com/maps/tutorials/visualizing/earthquakes~~

###Other examples of outages
[Georgia Power](http://outagemap.georgiapower.com/external/default.html)  
[PGE](http://www.pge.com/myhome/outages/outage/)  

###Map Boundary Data
[productforums.google.com](https://productforums.google.com/forum/#!topic/maps/C1qeu-95bdE)  
[mapboundary.com](http://www.mapboundary.com/North_Dakota/Dickinson%2c_ND_CBSA.aspx)  
[maps.huge.info](http://maps.huge.info/)  
[mapzen.com](https://mapzen.com/data/borders/)  

###Question on Autocomplete with submit form
[google maps trigger search box on button click](http://stackoverflow.com/questions/20407045/google-maps-trigger-search-box-on-button-click)  

##Grunt and Bower setup
to get bower and grunt running... first do

	sudo npm init
	sudo npm install grunt --save-dev
	sudo npm install grunt-bowercopy --save-dev

then

	bower init
	bower install bootstrap --save-dev
	bower install jquery --save-dev

then create a Gruntfile.js in the root directory

now you can run

	npm install
	grunt
