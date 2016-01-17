module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        nodemon: {
            dev: {
                script: 'backend/node/src/server.js',
                options: {
                    env: {
                        PORT: '3000'
                    }
                }
            }
        },

        jshint: {
            frontend: {
                src: [
                    'public/scripts/**/*.js',
                    '!public/scripts/vendor/**/*.js'
                ]
            }
        },


        /**
         * @README
         * http://angular.github.io/protractor/#/getting-started
         * https://www.credera.com/blog/technology-insights/java/testing-angularjs-part-5-protractor-grunt/
         * https://www.npmjs.com/package/grunt-protractor-runner
         **/
        protractor: {
            options: {
                configFile: "test/e2e/protractor.conf.js", // Default config file
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                webdriverManagerUpdate: true,
                args: {
                    // Arguments passed to the command
                }
            },
            all: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
                options: {
                    //configFile: "e2e.conf.js", // Target-specific config file
                    args: {} // Target-specific arguments
                }
            }
        },

        karma: {

            unit: {
                options: {
                    files: [
                        'public/scripts/vendor/angular/angular.min.js',
                        'public/scripts/vendor/angular/angular-route.min.js',
                        'public/scripts/vendor/angular/angular-mocks.js',

                        'public/scripts/app.js',
                        'public/scripts/app-config.js',
                        'public/scripts/app-events.js',
                        'public/scripts/app-routing.js',
                        'public/scripts/controllers/**/*.js',
                        'public/scripts/directives/**/*.js',
                        'public/scripts/services/**/*.js',

                        'test/spec/**/*.js'
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
                    './public/scripts/**/*.js': ['coverage']
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
                    'karma-chrome-launcher',
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

    grunt.registerTask('tests:frontend', [
        'karma:unit'
    ]);

    grunt.registerTask('tests:e2e', [
        'protractor'
    ]);

    grunt.registerTask('tests', [
        'tests:frontend',
        'tests:e2e'
    ]);

    grunt.registerTask('server', [
        'nodemon:dev'
    ]);

    grunt.registerTask('default', [
        'bower',
        'jshint',
        'tests'
    ]);

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');

    //grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-protractor-runner');

    grunt.loadNpmTasks('grunt-bower');

};