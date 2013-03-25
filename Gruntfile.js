
module.exports = function(grunt){

	var info, options;

	info = grunt.file.readJSON("./component.json");
	options = {
		splitBanners : true,
		banner : grunt.file.read("./src/banner.js").replace("{{version}}", info.version)
	};

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.initConfig({
		concat : {
			dist : {
				options : options,
				src : ["./src/imagery.js"],
				dest : "./dist/imagery.js"
			}
		},
		uglify : {
			options : options,
			dist : {
				src : ["./src/imagery.js"],
				dest : "./dist/imagery.min.js"
			}
		}
	});

	grunt.registerTask("default", ["concat", "uglify"]);

};