define(['ember', 'app/app', 'mixins/lazy_loader_mixin'], function(Ember, App) {
    App.AboutRoute = Ember.Route.extend(App.LazyLoaderMixin, {
        requireLists: [
            'templates/about'
        ]
    });
});
