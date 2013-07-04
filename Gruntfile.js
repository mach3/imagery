
module.exports = function(grunt){

	var info, options;

	info = grunt.file.readJSON("./bower.json");
	options = {
		splitBanners : true,
		banner : grunt.template.process(grunt.file.read("./src/banner.js"), {data: info})
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