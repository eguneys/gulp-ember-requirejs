requirejs.config({
    baseUrl: '/public/assets/scripts/lib',
    paths: {
        app: '../',
        routes: '../routes',
        controllers: '../controllers',
        templates: '../../templates',
        mixins: '../mixins',
        ember: 'ember/ember',
        jquery: 'jquery/dist/jquery',
        requirejs: 'requirejs/require',
        handlebars: 'handlebars/handlebars',
        // http://stackoverflow.com/questions/13377373/shim-twitter-bootstrap-for-requirejs
        bootstrap: 'bootstrap-sass-official/assets/javascripts/bootstrap'
    },
    shim: {
        ember: {
            deps: [
                'handlebars',
                'jquery'
            ],
            exports: 'Ember'
        },
        'bootstrap/transition': { deps: ['jquery'] },
        'bootstrap/collapse': { deps: ['jquery', 'bootstrap/transition'] }
    },
    packages: [

    ]
});
