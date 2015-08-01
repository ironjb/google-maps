#Google Maps Tutorial

###May help with showing outage:
https://developers.google.com/maps/documentation/javascript/heatmaplayer
https://github.com/googlemaps/js-marker-clusterer

###Spherical documentation
https://developers.google.com/maps/documentation/javascript/reference#spherical

###Handling many markers
http://www.svennerberg.com/2009/01/handling-large-amounts-of-markers-in-google-maps/
https://github.com/googlemaps/js-marker-clusterer

###Tutorials
~~https://developers.google.com/maps/tutorials/~~

###Current Tutorial location:
~~https://developers.google.com/maps/tutorials/visualizing/earthquakes~~



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
