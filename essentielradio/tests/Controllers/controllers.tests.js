describe('Controllers', function(){
    var scope;

    // load the controller's module
    beforeEach(module('essentielradio.controllers'));
    beforeEach(module('essentielradio.services'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('LiveCtrl', {$scope: scope});
    }));

    // tests start here
    xit('dummy test', function(){
        expect(true).toEqual(true);
    });
});