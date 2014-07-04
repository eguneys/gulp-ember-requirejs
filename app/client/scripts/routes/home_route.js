define(['ember', 'app/app', 'mixins/lazy_loader_mixin'], function(Ember, App) {
    App.HomeRoute = Ember.Route.extend(App.LazyLoaderMixin, {
        requireLists: [
            'templates/home'
        ]
    });
});
