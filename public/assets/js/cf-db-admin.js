
angular.module("cf-db", ['ngRoute', 'cf-templates'])
    .config(MainConfig)
    .factory("Request", RequestWrapper)
    .factory("Navigation", Navigation)
    .factory("AuthService", AuthService)
    .controller("MainController", MainController)
    .controller("DatabaseController", DatabaseController)
;

function MainConfig($routeProvider, $locationProvider) {
    $routeProvider
        .when('/Databases/', {
            templateUrl: '/cf-templates/Databases.html',
            controller: 'DatabaseController',
            controllerAs: 'databaseCtrl',
            public: false
        })
        .when('/Databases/:databaseName/', {
            templateUrl: '/cf-templates/Databases.html',
            controller: 'DatabaseController',
            controllerAs: 'databaseCtrl',
            public: false
        })
        .when('/log-in/', {
            templateUrl: '/cf-templates/Log-In.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl',
            public: true
        })
        .when('/Book/:bookId/ch/:chapterId', {
            templateUrl: 'chapter.html',
            controller: 'ChapterController'
        });

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
}

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

        login: function () {
            /**
             * @todo write an actual login script
             */
            this.loggedIn = true;
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

    ctrl.databases = [
        {name: 'test1'},
        {name: 'test2'},
        {name: 'test3'},
        {name: 'MyDb'},
        {name: 'Some_Db'},
        {name: 'My Database'}
    ]

    ctrl.params = $routeParams;

    AuthService.isLoggedIn();

    console.log('DatabaseController ran');
};


angular.module('cf-templates', ['/cf-templates/Databases.html', '/cf-templates/Log-In.html']);

angular.module("/cf-templates/Databases.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Databases.html",
    "<h2>Databases template</h2>\n" +
    "<ul>\n" +
    "    <li>debug : {{databaseCtrl.debug}}</li>\n" +
    "</ul>\n" +
    "\n" +
    "<div ng-show=\"databaseCtrl.databases\">\n" +
    "\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"database in databaseCtrl.databases\">\n" +
    "           <a href=\"/Databases/{{database.name}}/\">{{database.name}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "<ul>\n" +
    "    <li ng-repeat=\"(name, param) in databaseCtrl.params\">\n" +
    "        <pre>{{name}} = {{param}}</pre>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("/cf-templates/Log-In.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Log-In.html",
    "<h1>Log In</h1>\n" +
    "\n" +
    "<p>Temp Login place holder</p>\n" +
    "\n" +
    "<button class=\"button\" ng-click=\"loginCtrl.login()\">Log in</button>");
}]);

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
