define(['app/app'], function(App) {
    App.Router.map(function() {
        this.resource('home', { path: '/' });
        this.resource('about');
        this.route('catchall', { path: '/*wildcard'});
    });

    App.Router.reopen({
        location: 'history'
    });
});
