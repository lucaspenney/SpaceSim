module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['js/*.js', 'client.js'],
        tasks: ['browserify'],
      }
    },
    concat: {
      compile: {
        src: ['!js/server', 'js/entity.js',
          'js/*.js'
        ],
        dest: 'compiled.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      build: {
        src: 'js/*.js',
        dest: 'build/compiled.js'
      }
    },
    browserify: {
      options: {},
      'compiled.js': ['client.js']
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['concat']);
  grunt.registerTask('build', ['copy:build', 'uglify:build']);
};