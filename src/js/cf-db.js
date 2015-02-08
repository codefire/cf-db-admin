angular.module("cf-db", ['ngRoute', 'ngCookies', 'cf-templates'])
    .config(MainConfig)
    .factory("Settings", SettingService)
    .factory("Token", TokenService)
    .factory("CodeFireHttpInterceptor", HttpInterceptor)
    .factory("Notify", Notify)
    .factory("Request", RequestWrapper)
    .factory("Navigation", Navigation)
    .factory("AuthService", AuthService)
    .controller("MainController", MainController)
    .controller("DatabaseController", DatabaseController)
    .controller("TableController", TableController)
    .controller("FieldsController", FieldsController)
    .controller("BrowseController", BrowseController)
;

function MainConfig($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
        .when('/Databases/', {
            templateUrl: '/cf-templates/Databases.html',
            controller: 'DatabaseController',
            controllerAs: 'databaseCtrl',
            public: false
        })
        .when('/Databases/:database/Tables/', {
            templateUrl: '/cf-templates/Tables.html',
            controller: 'TableController',
            controllerAs: 'tableCtrl',
            public: false
        })
        .when('/Databases/:database/Tables/:table/', {
            templateUrl: '/cf-templates/Fields.html',
            controller: 'FieldsController',
            controllerAs: 'fieldCtrl',
            public: false
        })
        .when('/Databases/:database/Tables/:table/browse/', {
            templateUrl: '/cf-templates/Browse.html',
            controller: 'BrowseController',
            controllerAs: 'browseCtrl',
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

    $httpProvider.interceptors.push('CodeFireHttpInterceptor');
}


/** @todo Request needs to send token with every request, and handle some errors globally */
/** @todo Request needs to send requests to the correct api endpoint */
RequestWrapper.$inject = ["$http", "Token", "Settings"];
function RequestWrapper($http, Token, Settings) {
    return {
        foreground: function () {
            if (arguments) {
                if (arguments[0]) {
                    if(typeof(arguments[0].data) == 'undefined' || !arguments[0].data)
                        arguments[0].data = {}
                    arguments[0].url = Settings.apiUrl + Settings.apiType + '/' + arguments[0].endPoint
                    arguments[0].loadType = "foreground";
                    arguments[0].data.auth = Token;
                }
            }
            return $http.apply($http, arguments);
        },
        background: function () {
            if (arguments) {
                if (arguments[0]) {
                    if(typeof(arguments[0].data) == 'undefined' || !arguments[0].data)
                        arguments[0].data = {}
                    arguments[0].url = Settings.apiUrl + Settings.apiType + '/' + arguments[0].endPoint
                    arguments[0].loadType = "background";
                    arguments[0].data.auth = Token;
                }
            }
            return $http.apply($http, arguments);
        },
        invisible: function () {
            if (arguments) {
                if (arguments[0]) {
                    if(typeof(arguments[0].data) == 'undefined' || !arguments[0].data)
                        arguments[0].data = {}
                    arguments[0].url = Settings.apiUrl + Settings.apiType + '/' + arguments[0].endPoint
                    arguments[0].loadType = "invisible";
                    arguments[0].data.auth = Token;
                }
            }
            return $http.apply($http, arguments);
        }
    };
};

function Navigation($location) {
    return {
        showView: true,
        params: [],
        redirectTo: null,
        loadParams: function(params){
            this.params = params;
            return this;
        },
        redirect: function(){
            if(this.redirectTo){
                $location.url(this.redirectTo);
            }
            this.redirectTo = null;
        }
    };
}

function TokenService() {
    return {
        token: null
    }
}

function SettingService() {
    return {
        apiUrl: '/api/',
        apiType: 'dummy'
    }
}

function Notify($window, Settings) {
    return {
        errors: [],
        warnings: [],
        messages: [],
        error: function (message, data, status) {
            this.errors.push({
                message: message
            });
            return this.stackErrors(data);
        },
        warning: function (message) {
            return this.warnings.push({
                message: message
            });
            //return angular.element.growl.warning({
            //    message: message,
            //    duration: 25000
            //});
        },
        info: function (message) {
            return this.messages.push({
                message: message
            });
        },
        message: function(message) {
            return this.info(message);
        },
        stackErrors: function (data) {
            var error, msg, warning, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _results;
            if (typeof data === 'object' || typeof data === 'array') {
                if (data.errors) {
                    _ref = data.errors;
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        error = _ref[_i];
                        //angular.element.growl.error({
                        //    message: error,
                        //    duration: 25000
                        //});
                        this.errors.push({
                            message: error
                        });
                    }
                }
                if (data.warnings) {
                    _ref1 = data.warnings;
                    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                        warning = _ref1[_j];
                        this.warning(warning);
                    }
                }
                if (data.messages) {
                    _ref2 = data.messages;
                    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                        msg = _ref2[_k];
                        this.info(msg);
                    }
                }
                if (data.notices) {
                    _ref3 = data.notices;
                    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                        msg = _ref3[_l];
                        this.info(msg);
                    }
                }
                if (data.infos) {
                    _ref4 = data.infos;
                    _results = [];
                    for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
                        msg = _ref4[_m];
                        _results.push(this.info(msg));
                    }
                    return _results;
                }
            }
        },
        loading: function (type, flag) {
            var workingSelector;
            workingSelector = '#loading-foreground';
            if (type === 'invisible') {
                return true;
            }
            if (type === 'background') {
                workingSelector = '#loading-background';
            }
            if (flag !== 1 && flag !== true) {
                flag = 0;
            }
            return angular.element(workingSelector).toggleClass('showing');
        },
        notFound: function(endPoint){
            this.error('API end Point ' + endPoint + ' could not be found at ' + Settings.apiUrl + Settings.apiType + '/' + endPoint)
        },
        clear: function () {
            this.errors = [];
            this.warnings = [];
            this.messages = [];
        }
    };
}


function HttpInterceptor($q, Notify) {
    return {
        request: function (config) {
            Notify.clear();
            Notify.loading(config.loadType, 1);
            return config || $q.when(config);
        },
        requestError: function (rejection) {
            Notify.stackErrors(rejection.data);
            return $q.reject(rejection);
        },
        response: function (response) {
            var contentType = '';
            if(typeof(response.headers()['content-type']) != 'undefined')
                contentType = response.headers()['content-type'];

            if (contentType.indexOf('application/json') != -1) {
                // Validate response, if not ok reject
                // var data = examineJSONResponse(response); // assumes this function is available
                Notify.stackErrors(response.data);

                //if (!data)
                //    return $q.reject(response);

            } else if (typeof(response.config) != 'undefined') {
                if (typeof(response.config.endPoint) != 'undefined' && response.config.endPoint.indexOf('.json') != -1) {
                    if (response.headers()['content-type'].indexOf('json') == -1) {
                        Notify.error('API '+response.config.endPoint+' Returned non-JSON response', {}, response.status);
                        return $q.reject(response);
                    }
                }
            }

            return response;
        },
        responseError: function (response) {
            Notify.loading(response.config.loadType, 0);
            if(response.status == 404){
                Notify.notFound(response.config.endPoint);
            }else{
                Notify.error(response.statusText, response.data, response.status);
            }

            // do something on error
            return $q.reject(response);
        }
    };
}

AuthService.$inject = ["$location", "$cookies", "Token", "Request", "Navigation", "Notify"];
function AuthService($location, $cookies, Token, Request, Navigation, Notify) {
    return {
        loggedIn: false,
        bucket: Token,

        login: function (credentials) {
            var auth = this;
            Request.foreground({
                method: "post",
                endPoint: "log-in.json",
                data: {
                    credentials: credentials
                }
            }).success(function (data, status) {
                auth.postLogin(data);
            }).error(function (data, status) {
                auth.logout();
            });
        },
        postLogin: function(data){
            var auth = this;
            if (data.payload.loggedIn == true) {
                auth.loggedIn = true;
                auth.bucket.token = data.payload.token;
                $cookies.cfToken = auth.bucket.token;
                Navigation.redirect();
            }else{
                auth.logout();
            }
        },
        logout: function () {
            Request.invisible({
                method: "post",
                endPoint: "log-out.json"
            }).success(function (data, status) {

            }).error(function (data, status) {

            });

            this.loggedIn = false;
            this.bucket.token = null;
            delete $cookies['cfToken'];
        },
        isLoggedIn: function (redirect) {
            var auth = this;
            if (typeof(redirect) == 'undefined')
                redirect = true;

            var cookieToken = $cookies.cfToken;
            if(typeof(cookieToken) != 'undefined' && this.loggedIn == false){
                this.loggedIn = true;
                this.bucket.token = cookieToken;

                Request.invisible({
                    method: "post",
                    endPoint: "log-in.json",
                    data: {
                        token: this.bucket.token
                    }
                }).success(function (data, status) {
                    auth.postLogin(data);
                }).error(function (data, status) {
                    auth.logout();
                });
            }

            if (this.loggedIn == false) {
                if (redirect == true){
                    Navigation.redirectTo = $location.path();
                    $location.url('/log-in/')
                }
            }
            return this.loggedIn;
        }
    }
}


MainController.$inject = ["$window", "Request", "$route", "$routeParams", "$location", "Navigation", "AuthService", "Settings", "Notify"];
function MainController($window, Request, $route, $routeParams, $location, Navigation, AuthService, Settings, Notify) {
    var ctrl;
    ctrl = this;
    ctrl.debug = "If you can see this, then MainController is working :)";
    ctrl.dataLoaded = false;
    ctrl.location = $location;
    ctrl.route = $route;
    ctrl.errors = [];

    ctrl.navigation = Navigation;
    ctrl.navigation.loadParams($routeParams);

    ctrl.auth = AuthService;
    ctrl.notifications = Notify;

    // default settings
    ctrl.settings = Settings;

    AuthService.isLoggedIn();

    ctrl.logout = function () {
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

    ctrl.navigation = Navigation;
    ctrl.navigation.loadParams($routeParams);

    ctrl.databases = []

    AuthService.isLoggedIn();

    ctrl.loadDatabases = function () {
        Request.foreground({
            method: "post",
            endPoint: "databases.json",
            data: {
                loginData: 'test'
            }
        }).success(function (data, status) {
            ctrl.databases = data.payload.databases;
        }).error(function (data, status) {

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

    ctrl.navigation = Navigation;
    ctrl.navigation.loadParams($routeParams);

    ctrl.tables = []

    AuthService.isLoggedIn();

    ctrl.loadTables = function () {
        Request.foreground({
            method: "post",
            endPoint: "tables.json",
            data: {
                database: ctrl.navigation.params.database
            }
        }).success(function (data, status) {
            ctrl.tables = data.payload.tables;
        }).error(function (data, status) {

        });
    }

    ctrl.loadTables();

};

FieldsController.$inject = ["$window", "Request", "$route", "$routeParams", "$location", "Navigation", "AuthService"];
function FieldsController($window, Request, $route, $routeParams, $location, Navigation, AuthService) {

    var ctrl;
    ctrl = this;
    ctrl.debug = "If you can see this, then FieldsController is working :)";
    ctrl.dataLoaded = false;
    ctrl.location = $location.path()
    ctrl.errors = [];

    ctrl.navigation = Navigation;
    ctrl.navigation.loadParams($routeParams);

    ctrl.fields = []

    AuthService.isLoggedIn();

    ctrl.loadFields = function () {
        Request.foreground({
            method: "post",
            endPoint: "fields.json",
            data: {
                database: ctrl.navigation.params.database,
                table: ctrl.navigation.params.table
            }
        }).success(function (data, status) {
            ctrl.fields = data.payload.fields;
        }).error(function (data, status) {

        });
    }

    ctrl.loadFields();

};

BrowseController.$inject = ["$window", "Request", "$route", "$routeParams", "$location", "Navigation", "AuthService"];
function BrowseController($window, Request, $route, $routeParams, $location, Navigation, AuthService) {

    var ctrl;
    ctrl = this;
    ctrl.debug = "If you can see this, then BrowseController is working :)";
    ctrl.dataLoaded = false;
    ctrl.location = $location.path()
    ctrl.errors = [];

    ctrl.navigation = Navigation;
    ctrl.navigation.loadParams($routeParams);

    ctrl.table = []

    AuthService.isLoggedIn();

    ctrl.loadFields = function () {
        Request.foreground({
            method: "post",
            endPoint: "browse.json",
            data: {
                database: ctrl.navigation.params.database,
                table: ctrl.navigation.params.table,
                page: 1,
                perPage: 30
            }
        }).success(function (data, status) {
            ctrl.table = data.payload;
        }).error(function (data, status) {

        });
    }

    ctrl.loadFields();

};
