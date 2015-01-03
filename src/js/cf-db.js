angular.module("cf-db", ['ngRoute', 'cf-templates'])
    .config(MainConfig)
    .factory("Request", RequestWrapper)
    .factory("Navigation", Navigation)
    .factory("AuthService", AuthService)
    .controller("MainController", MainController)
    .controller("DatabaseController", DatabaseController)
    .controller("TableController", TableController)
    .controller("FieldsController", FieldsController)
;

function MainConfig($routeProvider, $locationProvider) {
    $routeProvider
        .when('/Databases/', {
            templateUrl: '/cf-templates/Databases.html',
            controller: 'DatabaseController',
            controllerAs: 'databaseCtrl',
            public: false
        })
        .when('/Databases/:databaseName/Tables/', {
            templateUrl: '/cf-templates/Tables.html',
            controller: 'TableController',
            controllerAs: 'tableCtrl',
            public: false
        })
        .when('/Tables/:tableName/', {
            templateUrl: '/cf-templates/Fields.html',
            controller: 'FieldsController',
            controllerAs: 'fieldCtrl',
            public: false
        })
        .when('/log-in/', {
            templateUrl: '/cf-templates/Log-In.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl',
            public: true
        })
        ;

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
}


/** @todo Request needs to send token with every request, and handle some errors globally */
/** @todo Request needs to send requests to the correct api endpoint */

function RequestWrapper($http) {
    return {
        foreground: function () {
            if (arguments) {
                if (arguments[0]) {
                    arguments[0].loadType = "foreground";
                }
            }
            return $http.apply($http, arguments);
        },
        background: function () {
            if (arguments) {
                if (arguments[0]) {
                    arguments[0].loadType = "background";
                }
            }
            return $http.apply($http, arguments);
        },
        invisible: function () {
            if (arguments) {
                if (arguments[0]) {
                    arguments[0].loadType = "invisible";
                }
            }
            return $http.apply($http, arguments);
        }
    };
};

function Navigation() {
    return {
        showView: true
    };
}

AuthService.$inject = ["$location", "Request", "Navigation"];
function AuthService($location, Request, Navigation) {
    return {
        loggedIn: false,
        token: null,

        login: function (credentials) {
            /**
             * @todo write an actual login script
             */
            var auth = this;

            Request.foreground({
                method: "post",
                url: "/api/dummy/log-in.json",
                data: {
                    credentials: credentials
                }
            }).success(function(data, status) {
                if (typeof console !== "undefined" && console !== null) {
                    console.log('api success', data);
                }
                if(data.payload.loggedIn == true){
                    auth.loggedIn = true;
                    auth.token = data.payload.token;
                }
            }).error(function(data, status) {
                if (typeof console !== "undefined" && console !== null) {
                    console.log('api error', data);
                }
            });
        },

        logout: function () {
            /**
             * @todo write an actual logout script
             */
            this.loggedIn = false;
        },
        isLoggedIn: function( redirect ){
            if(typeof(redirect) == 'undefined')
                redirect = true;

            if(this.loggedIn == false){
                if(redirect == true)
                    $location.url('/log-in/')
            }
            return this.loggedIn;
        }
    }
}


MainController.$inject = ["$window", "Request", "$route", "$routeParams", "$location", "Navigation", "AuthService"];
function MainController($window, Request, $route, $routeParams, $location, Navigation, AuthService) {
    var ctrl;
    ctrl = this;
    ctrl.debug = "If you can see this, then MainController is working :)";
    ctrl.dataLoaded = false;
    ctrl.location = $location;
    ctrl.route = $route;
    ctrl.errors = [];

    ctrl.Navigation = Navigation;
    ctrl.auth = AuthService;

    // default settings
    ctrl.settings = {
        apiType: 'dummy'
    }

    AuthService.isLoggedIn();

    ctrl.logout = function(){
        AuthService.logout();
        $location.url('/log-in/');
    }

};

DatabaseController.$inject = ["$window", "Request", "$route", "$routeParams", "$location", "Navigation", "AuthService"];
function DatabaseController($window, Request, $route, $routeParams, $location, Navigation, AuthService) {
    var ctrl;
    ctrl = this;
    ctrl.debug = "If you can see this, then DatabaseController is working :)";
    ctrl.dataLoaded = false;
    ctrl.location = $location.path()
    ctrl.errors = [];

    ctrl.Navigation = Navigation;

    ctrl.databases = []

    ctrl.params = $routeParams;
    AuthService.isLoggedIn();

    ctrl.loadDatabases = function(){
        Request.foreground({
            method: "post",
            url: "/api/dummy/databases.json",
            data: {
                loginData: 'test'
            }
        }).success(function(data, status) {
            if (typeof console !== "undefined" && console !== null) {
                console.log('api success', data);
            }
            ctrl.databases = data.payload.databases;
        }).error(function(data, status) {
            if (typeof console !== "undefined" && console !== null) {
                console.log('api error', data);
            }
        });
    }

    ctrl.loadDatabases();

};

TableController.$inject = ["$window", "Request", "$route", "$routeParams", "$location", "Navigation", "AuthService"];
function TableController($window, Request, $route, $routeParams, $location, Navigation, AuthService) {
    var ctrl;
    ctrl = this;
    ctrl.debug = "If you can see this, then TableController is working :)";
    ctrl.dataLoaded = false;
    ctrl.location = $location.path()
    ctrl.errors = [];

    ctrl.Navigation = Navigation;

    ctrl.tables = []

    ctrl.params = $routeParams;
    AuthService.isLoggedIn();

    ctrl.loadTables = function(){
        Request.foreground({
            method: "post",
            url: "/api/dummy/tables.json",
            data: {
                loginData: 'test'
            }
        }).success(function(data, status) {
            if (typeof console !== "undefined" && console !== null) {
                console.log('api success', data);
            }
            ctrl.tables = data.payload.tables;
        }).error(function(data, status) {
            if (typeof console !== "undefined" && console !== null) {
                console.log('api error', data);
            }
        });
    }

    ctrl.loadTables();

};

FieldsController.$inject = ["$window", "Request", "$route", "$routeParams", "$location", "Navigation", "AuthService"];
function FieldsController($window, Request, $route, $routeParams, $location, Navigation, AuthService) {

    console.log('Fields Controller');

    var ctrl;
    ctrl = this;
    ctrl.debug = "If you can see this, then FieldsController is working :)";
    ctrl.dataLoaded = false;
    ctrl.location = $location.path()
    ctrl.errors = [];

    ctrl.Navigation = Navigation;

    ctrl.fields = []

    ctrl.params = $routeParams;
    AuthService.isLoggedIn();

    ctrl.loadFields = function(){
        Request.foreground({
            method: "post",
            url: "/api/dummy/fields.json",
            data: {
                loginData: 'test'
            }
        }).success(function(data, status) {
            if (typeof console !== "undefined" && console !== null) {
                console.log('api success', data);
            }
            ctrl.fields = data.payload.fields;
        }).error(function(data, status) {
            if (typeof console !== "undefined" && console !== null) {
                console.log('api error', data);
            }
        });
    }

    ctrl.loadFields();

};