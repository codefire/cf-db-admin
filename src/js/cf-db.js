angular.module("cf-db", ['ngRoute', 'cf-templates'])
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
;

function MainConfig($routeProvider, $locationProvider, $httpProvider) {
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
                    arguments[0].url = Settings.apiUrl + Settings.apiType + '/' + arguments[0].endPoint
                    arguments[0].loadType = "invisible";
                    arguments[0].data.auth = Token;
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

function Notify($window) {
    return {
        errors:[],
        warnings:[],
        messages:[],
        error: function(message, data, status) {
            if (typeof console !== "undefined" && console !== null) {
                console.log('Notify - error : ', message, status, data);
            }

            this.errors.push({
                message: message
            });

            //if (!status || status === 200) {
            //    angular.element.growl.error({
            //        message: message,
            //        duration: 25000
            //    });
            //} else {
            //    angular.element.growl.error({
            //        message: message + "status code " + status,
            //        duration: 25000
            //    });
            //}

            return this.stackErrors(data);
        },
        warning: function(message) {
            return this.warnings.push({
                message: message
            });
            //return angular.element.growl.warning({
            //    message: message,
            //    duration: 25000
            //});
        },
        info: function(message) {
            return this.messages.push({
                message: message
            });
            //console.log('Notify.info');
            //return angular.element.growl.notice({
            //    message: message,
            //    duration: 25000
            //});
        },
        stackErrors: function(data) {
            var error, msg, warning, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _results;
            if (typeof data === 'object' || typeof data === 'array') {

                console.log('Notify.stackErrors', data);

                angular.element('#growls').remove();
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
        loading: function(type, flag) {
            console.log('Notify.loading');
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
        clear: function(){
            this.errors = [];
            this.warnings = [];
            this.messages = [];
        }
    };
}


function HttpInterceptor($q, Notify) {
    return {
        request: function(config) {
            Notify.clear();
            Notify.loading(config.loadType, 1);
            return config || $q.when(config);
        },
        requestError: function(rejection) {
            Notify.stackErrors(rejection.data);
            return $q.reject(rejection);
        },
        response: function (response) {

            Notify.stackErrors(response.data);

            if (response.headers()['content-type'] === "application/json; charset=utf-8") {
                // Validate response, if not ok reject
                var data = examineJSONResponse(response); // assumes this function is available

                if (!data)
                    return $q.reject(response);

            } else if (typeof(response.config) != 'undefined') {
                if (typeof(response.config.endPoint) != 'undefined' && response.config.endPoint.indexOf('.json') != -1) {
                    if (response.headers()['content-type'].indexOf('json') == -1) {
                        Notify.error('API Returned non-JSON response', {}, response.status);
                        return $q.reject(response);
                    }
                }
            }

            return response;
        },
        responseError: function (response) {
            Notify.loading(rejection.config.loadType, 0);
            Notify.error(rejection.statusText, rejection.data, rejection.status);
            // do something on error
            return $q.reject(response);
        }
    };
}

AuthService.$inject = ["$location", "Token", "Request", "Navigation"];
function AuthService($location, Token, Request, Navigation) {
    return {
        loggedIn: false,
        bucket: Token,

        login: function (credentials) {
            /**
             * @todo write an actual login script
             */
            var auth = this;

            Request.foreground({
                method: "post",
                endPoint: "log-in.json",
                data: {
                    credentials: credentials
                }
            }).success(function (data, status) {
                if (typeof console !== "undefined" && console !== null) {
                    //console.log('api success', data);
                }
                if (data.payload.loggedIn == true) {
                    auth.loggedIn = true;
                    auth.bucket.token = data.payload.token;
                }
            }).error(function (data, status) {
                if (typeof console !== "undefined" && console !== null) {
                    //console.log('api error', data);
                }
            });
        },

        logout: function () {
            /**
             * @todo write an actual logout script
             */
            this.loggedIn = false;
        },
        isLoggedIn: function (redirect) {
            if (typeof(redirect) == 'undefined')
                redirect = true;

            if (this.loggedIn == false) {
                if (redirect == true)
                    $location.url('/log-in/')
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

    ctrl.Navigation = Navigation;
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

    ctrl.Navigation = Navigation;

    ctrl.databases = []

    ctrl.params = $routeParams;
    AuthService.isLoggedIn();

    ctrl.loadDatabases = function () {
        Request.foreground({
            method: "post",
            endPoint: "databases.json",
            data: {
                loginData: 'test'
            }
        }).success(function (data, status) {
            if (typeof console !== "undefined" && console !== null) {
                //console.log('api success', data);
            }
            ctrl.databases = data.payload.databases;
        }).error(function (data, status) {
            if (typeof console !== "undefined" && console !== null) {
                //console.log('api error', data);
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

    ctrl.loadTables = function () {
        Request.foreground({
            method: "post",
            endPoint: "tables.json",
            data: {
                loginData: 'test'
            }
        }).success(function (data, status) {
            if (typeof console !== "undefined" && console !== null) {
                //console.log('api success', data);
            }
            ctrl.tables = data.payload.tables;
        }).error(function (data, status) {
            if (typeof console !== "undefined" && console !== null) {
                //console.log('api error', data);
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

    ctrl.loadFields = function () {
        Request.foreground({
            method: "post",
            endPoint: "fields.json",
            data: {
                loginData: 'test'
            }
        }).success(function (data, status) {
            if (typeof console !== "undefined" && console !== null) {
                //console.log('api success', data);
            }
            ctrl.fields = data.payload.fields;
        }).error(function (data, status) {
            if (typeof console !== "undefined" && console !== null) {
                //console.log('api error', data);
            }
        });
    }

    ctrl.loadFields();

};