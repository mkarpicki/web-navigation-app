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

            //karma: {
            //    unit: {
            //        configFile: 'karma.conf.js'
            //    }
            //}

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
                        //'scripts/app-routing.js',
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

                // preprocess matching files before serving them to the browser
                // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
                preprocessors: {
                    './scripts/**/*.js': ['coverage']
                },

                // test results reporter to use
                // possible values: 'dots', 'progress'
                // available reporters: https://npmjs.org/browse/keyword/karma-reporter
                reporters: ['progress', 'coverage', 'html'],

                htmlReporter: {
                    outputDir: './test-results/karma', // where to put the reports
                    templatePath: null, // set if you moved jasmine_template.html
                    focusOnFailures: true, // reports show failures on start
                    namedFiles: false, // name files instead of creating sub-directories
                    pageTitle: null, // page title for reports; browser info by default
                    urlFriendlyName: false, // simply replaces spaces with _ for files/dirs

                    // experimental
                    preserveDescribeNesting: false, // folded suites stay folded
                    foldAll: false // reports start folded (only with preserveDescribeNesting)
                },

                coverageReporter: {
                    type: 'html',
                    dir: 'test-results/coverage/'
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