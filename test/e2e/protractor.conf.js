exports.config = {
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    baseUrl: 'http://localhost:3000',
    specs: [
        'search-page.spec.js',
        'form-page.spec.js',
        'route-page.spec.js',
        'navigation.spec.js'
    ],

    directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
        //'browserName': 'firefox'
    },

    // Framework to use. Jasmine is recommended.
    framework: 'jasmine',

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }

};