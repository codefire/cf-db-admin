angular.module("cf-db")
    .controller("LoginController", LoginController)
;


LoginController.$inject = ["$window", "Request", "$route", "$routeParams", "$location", "Navigation", "AuthService"];
function LoginController($window, Request, $route, $routeParams, $location, Navigation, AuthService) {
    var ctrl;
    ctrl = this;
    ctrl.debug = "If you can see this, then LoginController is working :)";
    ctrl.dataLoaded = false;
    ctrl.location = $location.path()
    ctrl.errors = [];
    ctrl.Navigation = Navigation;

    console.log('login controller ran');

    ctrl.login = function(){
        AuthService.login();
        if(AuthService.isLoggedIn( false ) == true){
            $location.url('/Databases/')
        }
    }
};
