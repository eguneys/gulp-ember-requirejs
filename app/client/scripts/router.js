define(['app/app', 'routes/index_route', 'routes/about_route'], function(App) {
    App.Router.map(function() {
        this.resource('about');
        this.route('catchall', { path: '/*wildcard'});
    });

    App.Router.reopen({
        location: 'history'
    });
});
