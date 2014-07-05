requirejs.config({
    baseUrl: 'public/assets/scripts/lib',
    paths: {
        app: '../',
        routes: '../routes',
        models: '../models',
        views: '../views',
        controllers: '../controllers',
        templates: '../../templates',
        mixins: '../mixins',
        ember: 'ember/ember',
        jquery: 'jquery/dist/jquery',
        requirejs: 'requirejs/require',
        handlebars: 'handlebars/handlebars',
        bootstrap: 'bootstrap-sass-official/assets/javascripts/bootstrap',
        'ember-data': 'ember-data/ember-data'
    },
    shim: {
        ember: {
            deps: [
                'handlebars',
                'jquery'
            ],
            exports: 'Ember'
        },
        'ember-data': {
            deps: [
                'ember'
            ],
            exports: 'DS'
        },
        'bootstrap/transition': {
            deps: [
                'jquery'
            ]
        },
        'bootstrap/collapse': {
            deps: [
                'jquery',
                'bootstrap/transition'
            ]
        }
    },
    packages: [

    ]
});
