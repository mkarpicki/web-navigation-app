module.exports = function(grunt) {

    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({

        pkg: pkg,

        jshint: {
            frontend: {
                src: ['scripts/**/*.js']
            }
        }

    });

    grunt.registerTask('default', [
        'jshint'
    ]);

    grunt.loadNpmTasks('grunt-contrib-jshint');

};