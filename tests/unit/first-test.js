define(['app/app'], function(App) {
    module('Integration Tests', {
        teardown: function() {
            //App.reset();
        }
    });
    
    test('should pass', function() {
        expect(1);
        visit('/');

        andThen(function() {
            equal(find('h3').first().text().trim(), "Setting Up Gulp for Fullstack", 'Welcome message set.');
        });
    });
        
    test('should pass', function() {
        expect(1);
        equal(1, 1, 'oh yeah');
    });
});
