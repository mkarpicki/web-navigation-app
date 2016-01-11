exports.config = {
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    specs: [
        'form-page.spec.js',
        'search-page.spec.js'
    ],

    directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Framework to use. Jasmine is recommended.
    framework: 'jasmine',

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }

};