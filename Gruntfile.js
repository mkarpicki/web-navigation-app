module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            frontend: {
                src: [
                    'scripts/**/*.js',
                    '!scripts/vendor/**/*.js'
                ]
            }
        },
        karma: {
            unit: {
                options: {
                    files: [
                        'scripts/vendor/angular/angular.min.js',
                        'scripts/vendor/angular/angular-route.min.js',
                        'scripts/vendor/angular/angular-mocks.js',
                        'test/spec/**/*.js',

                        'scripts/app.js',
                        'scripts/app-config.js',
                        'scripts/app-events.js',
                        'scripts/app-routing.js',
                        'scripts/controllers/**/*.js',
                        'scripts/directives/**/*.js',
                        'scripts/services/**/*.js'
                    ]
                },

                frameworks: ['jasmine'],

                exclude: [],


                colors: true,
                singleRun: true,

                // Start these browsers, currently available:
                // - Chrome
                // - ChromeCanary
                // - Firefox
                // - Opera
                // - Safari (only Mac)
                // - PhantomJS
                // - IE (only Windows)
                // CLI --browsers Chrome,Firefox,Safari
                browsers: ['PhantomJS'],

                coverageReporter: {
                    type: 'html',
                    dir: 'test/results/coverage/'
                },

                plugins: [
                    'karma-jasmine',
                    'karma-coverage',
                    'karma-phantomjs-launcher',
                    'karma-html-reporter'
                ]
            }
        },
        bower: {
            dev: {
                dest: 'scripts/'
            }
        }

    });

    grunt.registerTask('tests', [
        'karma'
    ]);

    grunt.registerTask('default', [
        'bower',
        'jshint',
        'tests'
    ]);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-bower');

};