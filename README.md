#Google Maps Tutorial

###May help with showing outage:
https://developers.google.com/maps/documentation/javascript/heatmaplayer
https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap
https://github.com/googlemaps/js-marker-clusterer

###Spherical documentation
https://developers.google.com/maps/documentation/javascript/reference#spherical

###Handling many markers
http://www.svennerberg.com/2009/01/handling-large-amounts-of-markers-in-google-maps/
https://github.com/googlemaps/js-marker-clusterer

###Geocode
https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
https://developers.google.com/maps/documentation/geocoding/intro

###Examples
https://developers.google.com/maps/documentation/javascript/examples/

###Tutorials
~~https://developers.google.com/maps/tutorials/~~

###Current Tutorial location:
~~https://developers.google.com/maps/tutorials/visualizing/earthquakes~~

###Other examples of outages
http://outagemap.georgiapower.com/external/default.html
http://www.pge.com/myhome/outages/outage/

###Map Boundary Data
https://productforums.google.com/forum/#!topic/maps/C1qeu-95bdE
http://www.mapboundary.com/North_Dakota/Dickinson%2c_ND_CBSA.aspx
http://maps.huge.info/

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
