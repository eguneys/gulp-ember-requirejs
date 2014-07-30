## Overview

Ember Fullstack is a fullstack project template for Ember.js and
Express projects. It allows users to quickly iterate while building
ambitious applications.

It is best used with
generator-emberfs. That provides you with this template as well as
scaffolding.

### Assets Compilation

Asset compilation is based on gulp.

Here's a list of supported tasks

* Handlebars
* Sass
* Compass
* RequireJS optimizer

You can find and add more gulp tasks and plugins as you need.

All of this compilation happens in the background while you're
developing, rebuilding each time you change a file.

### Modules

This template uses RequireJS modules.

### Testing using gulp

This template is configured to use QUnit, the Ember Testing package,
and the Ember QUnit. These tools, along with the same module system as
your application, make unit and integration tests a breeze to write.

### Dependency Management

This template uses the Bower package manager, making it easy to keep
your front-end dependencies up to date. NPM is used to manage server-side/internal
dependencies.

### Community

This template is designed with minimal core features necessary. We
welcome your issues and PRs for features, bug fixes, and anything that
would improve your quality of life as an Ember developer.

Talk to us here:

* issues: https://github.com/eguneys/gulp-ember-requirejs/issues

## Why?

I started this project for myself, I learned `gulp`, `requireJS`,
`ember`, `tdd` from scratch. It was a lot of fun.

I tried to copy `ember-cli` as much as i can, It works for me, and i
hope it works for you too.

## Getting Started

### Prerequisites

### Node

First, install the latest stable version of Node (version 0.10.x).

Follow instructions on [nodejs.org](nodejs.org).

### Ember Fullstack Template

Either clone this repo:
`git clone git@github.com:eguneys/gulp-ember-requirejs.git`

or use yeoman generator [generator emberfs](https://github.com/eguneys/generator-emberfs).

### Bower

Install Bower, package manager that manages your front-end
dependencies.

`npm install -g bower`

### PhantomJS

Integration tests will run on PhantomJS, You can install via npm:

`npm install -g phantomjs`

### Launch the template

```bash
cd template-app
gulp devserver
```

navigate to http://localhost:3000 to see your new app.


### Using Gulp Tasks

 Command | Purpose
 ------- | -------
 `gulp clean` | Cleans the build directory.
 `gulp build` | Builds and optimizes the project into build directory.
 `gulp build-dev` | Builds the project into build directory without optmization.
 `gulp devserver` | Launches server, and watches files for changes livereloading as you develop.
 `gulp devtdd` | Launches server, and runs testem that runs your tests, watches your source and test files for changes.
 `gulp test` | Runs tests with Testem on CI mode.

### Folder Layout

```bash
    .
    |-- .jshintrc           JSHint configuration.
    |-- .gitignore          Git ignore file.
    |-- .bowerrc            Bower configuration.
    |-- README.md           Readme file.
    |-- bower.json          Bower configuration and dependency list.
    |-- app                 Ember application, and server code.
    |-- config              Server side config files.
    |   `-- server.js       Server main file.
    |-- gulpfile.js         Build specifiction for gulp.
    |-- package.json        Npm configuration.
    |-- public              The project builds into this folder.
    |-- testem.json         Testem configuration.
    `-- tests               Includes unit and integration tests, various helpers to load and run the tests.
```

Layout within `app` folder

```bash
    app                             Project root
    |-- client                      Client side Ember application files
    |   |-- bower_components        Third party installed with bower
    |   |-- scripts                 Ember application code
    |   |   |-- controllers         Ember controllers
    |   |   |-- mixins              Ember mixins
    |   |   |-- models              Ember models
    |   |   |-- routes              Ember routes
    |   |   `-- views               Ember views
    |   |-- styles                  Stylesheets, compiled into `main.css`
    |   |   |-- layout              
    |   |   `-- pages
    |   |-- templates               Ember templates
    |   `-- vendor                  Third party libraries
    `-- views                       Express views
        `-- layouts                 Express view layouts
```

## Using RequireJS Modules & Resolver

Ember Fullstack Template uses RequireJS modules. This means you have
to wrap your files inside `define` module definitions.

You follow standard naming conventions for Ember. So `App.FooRoute`
would know to render `App.FooView` by default. You stuff everything
into `App` namespace defined in `app/app` module.

For example, this route definition in `app/routes/index.js`

```javascript
    define(['ember', 'app/app'], function(Ember, App) {
        App.IndexRoute = Ember.Route.extend({
            model: function() {
                return [];
            }
        });
    });
```

would result in a module called `routes/index`. Using the resolver,
when Ember looks up the index route, it will find this module.

You have to require dependencies with the following syntax:

```javascript
    define(['app/app', 'mixins/foo'], function(App) {
    });
```

Which will define the foo mixin in `App` namespace.

To use `Ember` or `DS` (for Ember Data) in your modules require them:

```javascript
    define(['ember', 'ember-data'], function(Ember, DS) {
    });
```

### Lazy Loading files with RequireJS

You can lazy load your files for each route of your application using `LazyLoaderMixin`.

Normally without lazy loading, you would define a route like this:

`File: scripts/routes/guides_route.js`
```javascript

    define(['ember',
            'app/app',
            'models/guide',
            'controllers/guide_controller',
            'templates/guides'], function(Ember, App) {
                App.GuidesRoute = Ember.Route.extend({
                model: function() {
                    return this.store.find('guide');
                }
                
            });
    });
    
```

If you want to lazy load the dependencies for this route, you would define it like this:

`File: scripts/routes/guides_route.js`
```javascript

    define(['ember',
            'app/app',
            'mixins/lazy_loader_mixin'], function(Ember, App) {
                App.GuidesRoute = Ember.Route.extend(App.LazyLoaderMixin, {
            requireLists: ['routes/guides_deps'],

            model: function() {
                return this.store.find('guide');
            },
        });
    });

```

`LazyLoaderMixin` calls `require` for `requireLists` at `beforeModel`
hook so those dependencies loads only when the route is visited.

`routes/guides_deps` module is a module defined in `routes/guides_deps.js`
and its contents include the dependencies that your route lazy loads.

`File: scripts/routes/guides_deps.js`
```javascript
define(['models/guide',
        'controllers/guide_controller',
        'templates/guides']);
```

When optimized, all dependencies in `routes/guides_deps` merges into
this file. When you visit the `guides` route only then this file is
loaded.

Finally you need to include `routes/guides_deps` as a module in
requirejs build config. It's inside `gulpfile.js`.

`File: gulpfile.js`
```javascript
{
    modules: [
        // `app/common` module is already defined.
        {
            name: 'app/common',
            include: ['app/main']
        },
        // you include `routes/guides_deps` module
        // also exclude 'app/common' module.
        {
            name: `routes/guides_deps`,
            exclude: ['app/common']
        }
    ]
}
```

And, don't forget to add your new route to your `router.js`.

`File: scripts/router.js`
```javascript
define(['app/app', 'routes/guides_route'], function(App) {
    App.Router.map(function() {
        this.route('guides');
    });
});
```

Note: If you are using `generator-emberfs` all these steps are done
automatically. See
[generator-emberfs](https://github.com/eguneys/generator-emberfs) for
more details.

### Precompiling Templates

In order to load your templates lazily you need to place your
templates for each route into seperate folders. Each subfolder inside
templates folder gets precompiled into its own file.

For example this templates folder:

```bash
    app/client/templates
    |-- _nav-main.hbs
    |-- application.hbs
    |-- catchall.hbs
    |-- guides
    |   |-- _guide.hbs
    |   |-- guide.hbs
    |   `-- index.hbs
    |-- guides.hbs
    |-- index.hbs
    `-- noroute.hbs
```

precompiles into:

```bash
    public/assets/templates
    |-- common.js    app/client/templates/*.hbs
    `-- guides.js    app/client/templates/guides/**/*.hbs
```
`common.js` includes everything in the `templates` folder excluding subfolders.
`guides.js` includes everything in the `templates/guides` folder including subfolders.


### Resolving from template helpers

`{{partial "foo"}}` will render the template within `templates/foo.hbs`

### Using global variables or external scripts

If you want to use external libraries that write to a global namespace
(e.g moment.js), you need to add those to the requireJS `shim` config.

`gulp bower-rjs` task automatically inserts the bower libraries into
your requireJS `path` config. You still have to add `shim` config.

## Naming Conventions

You would use Ember, Ember Data and Handlebars naming
conventions.

## Using with Ember Data

The current beta Ember Data is included with this template.

### Models

Create a todo model:

```javascript
    define(['ember-data', 'app/app'], function(DS, App) {
        App.TODO = DS.Model.extend({
            title: DS.attr('string'),
            isCompleted: DS.attr('boolean')
        });
    });
```
## Testing

### Writing a Test

Template uses QUnit library. The included tests demonstrate how to
write both unit tests and integration tests.

Test filenames should be suffixed with `-test.js`.

To run the tests in your browser, run `gulp tdd`, and follow testem
interface. Note that just like your app, your tests will auto rebuild
when `gulp tdd` is running.

By default, your integration tests will run on PhantomJS.

### CI Mode with Testem

`gulp test` will run your tests with `Testem` on CI mode. You can pass
any option to `Testem` using `testem.json` configuration file.

### Using ember test helpers for integration tests

You can use ember test helpers, as shown in ember guides for writing
integration tests.

### Using ember-qunit for unit tests

You can use `ember-qunit` which includes several helpers to make your
unit-tests easier.

## Asset Compilation

### Raw Assets
* `app/client`
* `app/client/images`
* `app/client/styles`
* `app/client/fonts`
* `app/client/scripts`
* `app/client/templates`
* `app/client/vendor`

### Stylesheets

Template supports Sass. You can add your sass styles to
`app/client/styles`, and it will be served at
`public/assets/styles/main.css`.

For example, to add bootstrap in your project you need to, install the
folders via bower:

`bower install --save-dev bootstrap`

Inject the script files into requirejs config:
`gulp bower-rjs`

Inject the sass files into `style.scss` file.
`gulp wiredep`

Or manually inject into style.sass

`@import "bootstrap-sass-official/assets/stylesheets/bootstrap.scss";`

### Fingerprinting and CDN URLs

Fingerprinting is not currently supported. You can use the
non-preffered approach and customize `urlArgs` in your requireJS
config.

## Managing Dependencies

Ember Fullstack Template uses Bower for dependency management.

### Bower Configuration

The Bower configuration file, `bower.json` is located at the root of
your project.  Default `bower_components` folder is defined in
`.bowerrc` file and defaults to `app/client/bower_components`.

You can inject your dependencies into your requirejs config file using
`gulp bower-rjs` command, and inject your sass files into your
main.sass file using `gulp wiredep` command.

## Generators & Scaffolding

You can use `generator-emberfs` for scaffolding for this template.

[generator-emberfs](https://github.com/eguneys/generator-emberfs)

## Server Side

// TODO

## Deployments

You can easily deploy your application to a number of places.
