requirejs.config({
    baseUrl: '/public/assets/scripts/lib',
    paths: {
        app: '../',
        templates: '../../templates',
        bootstrap: 'bootstrap/dist/js/bootstrap',
        ember: 'ember/ember',
        jquery: 'jquery/dist/jquery',
        requirejs: 'requirejs/require',
        handlebars: 'handlebars/handlebars'
    },
    shim: {
        ember: {
            deps: [
                'handlebars',
                'jquery'
            ],
            exports: 'Ember'
        }
    },
    packages: [

    ]
});
