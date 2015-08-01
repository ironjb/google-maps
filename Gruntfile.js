module.exports = function(grunt) {
	// Project configuration
	grunt.initConfig({
		bowercopy: {
			options: {
				srcPrefix: 'bower_components/'
			},
			bootstrap: {
				options: {
					srcPrefix: 'bower_components/bootstrap/'
				},
				files: {
					'less/bootstrap/': 'less/',
					'js/bootstrap/': 'dist/js/bootstrap.min.js',
					'fonts/bootstrap/': 'dist/fonts/'
				}
			},
			jquery: {
				options: {
					srcPrefix: 'bower_components/jquery/'
				},
				files: {
					'js/jquery/': 'dist/jquery.min.js'
				}
			},
			jsMarkerClusterer: {
				files: {
					'js/js-marker-clusterer/': 'bower_components/js-marker-clusterer/src/'
				}
			}
		}
	});

	// Load plugins and tasks
	grunt.loadNpmTasks('grunt-bowercopy');

	// Tasks
	grunt.registerTask('default', ['bowercopy']);
};
