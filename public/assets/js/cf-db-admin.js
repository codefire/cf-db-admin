
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
    .directive('cfPagination', cfPagination);
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
        apiType: 'php',
        viewType: 'list'
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
                $cookies.put('cfToken', auth.bucket.token);
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

            var cookieToken = $cookies.get('cfToken');
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
    ctrl.showSettings = false;

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

BrowseController.$inject = ["$window", "$scope", "Request", "$route", "$routeParams", "$location", "Navigation", "AuthService"];
function BrowseController($window, $scope,  Request, $route, $routeParams, $location, Navigation, AuthService) {

    var ctrl;
    ctrl = this;
    ctrl.debug = "If you can see this, then BrowseController is working :)";
    ctrl.dataLoaded = false;
    ctrl.location = $location.path()
    ctrl.errors = [];

    ctrl.navigation = Navigation;
    ctrl.navigation.loadParams($routeParams);

    ctrl.table = {
        fields: [],
        pagination: {
            page: 1,
            showing: 30
        },
        rows: []
    }

    AuthService.isLoggedIn();

    ctrl.loadTable = function () {
        Request.foreground({
            method: "post",
            endPoint: "browse.json",
            data: {
                database: ctrl.navigation.params.database,
                table: ctrl.navigation.params.table,
                page: ctrl.table.pagination.page,
                perPage: ctrl.table.pagination.showing
            }
        }).success(function (data, status) {
            ctrl.table = data.payload;
            ctrl.dataLoaded = true;
        }).error(function (data, status) {

        });
    }

    ctrl.changePage = function( number ){
        ctrl.loadTable();
    }

    ctrl.loadTable();

};


function cfPagination(){
    var directive = {
        restrict: 'E',
        templateUrl: '/cf-templates/directives/cf-pagination.html',
        scope: {
            pagination: '=',
            callback: '='
        },
        controller: cfPaginationController,
        controllerAs: 'ctrl',
        bindToController: true // because the scope is isolated
    };

    return directive;
}

cfPaginationController.$inject = ['$scope'];
function cfPaginationController($scope){
    var ctrl = this;
    ctrl.debug = 'hello from cfPaginationController';
    ctrl.pagination = {}; // populated from the directive
    // ctrl.callback; // populated from the directive

    $scope.$watch('ctrl.pagination', function(current, original) {
        if(original == current){
            return false;
        }

        ctrl.buildPagination();
    });

    ctrl.buildPagination = function(){

        var range = 4;

        var page = ctrl.pagination.page;
        var pages = ctrl.pagination.pages;
        var penultimatePage = ctrl.pagination.pages - 1;

        var min = 2;
        var max = 10;

        var numbers = [1];


        for(var i = 1; i <= range; i++){
            var p = page - i;
            if(p > 1)
                numbers.push( p );
        }

        if(page > 1 && page < pages)
            numbers.push( page );

        for(var i = 1; i <= range; i++){
            var p = page + i;
            if(p < penultimatePage)
                numbers.push( p );
        }

        numbers.push(pages);
        ctrl.pagination.numbers = numbers;
    }

    ctrl.selectPage = function( newPage ){
        if(newPage < 1 || newPage > ctrl.pagination.pages)
            return false;

        ctrl.pagination.page = newPage;
        ctrl.callback(newPage);
    }
}
angular.module('cf-templates', ['/cf-templates/Browse.html', '/cf-templates/Databases.html', '/cf-templates/Fields.html', '/cf-templates/Log-In.html', '/cf-templates/Tables.html', '/cf-templates/directives/cf-pagination.html']);

angular.module("/cf-templates/Browse.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Browse.html",
    "<div ng-show=\"browseCtrl.table\" class=\"row\">\n" +
    "\n" +
    "    <div class=\"columns small-12 cf-browse\">\n" +
    "    <h2 class=\"text-center-screen\">Browsing <strong>{{browseCtrl.table.name}}</strong> table in <strong>{{browseCtrl.navigation.params.database}}</strong> database</h2>\n" +
    "\n" +
    "        <div class=\"row collapse cf-row-count\">\n" +
    "            <div class=\"columns large-6\">\n" +
    "                <a href=\"/Databases/{{browseCtrl.navigation.params.database}}/Tables\" class=\"button left\"><i class=\"glyphicon glyphicon-chevron-left\"></i> Back to {{browseCtrl.navigation.params.database}} tables</a>\n" +
    "            </div>\n" +
    "            <div class=\"columns large-1 medium-2 small-3\">\n" +
    "                <span class=\"prefix\">Showing</span>\n" +
    "            </div>\n" +
    "            <div class=\"columns large-1 medium-2 small-2\">\n" +
    "                <input type=\"text\" ng-model=\"browseCtrl.table.pagination.showing\" class=\"text-center\"/>\n" +
    "            </div>\n" +
    "            <div class=\"columns large-2 medium-2 small-5 left\">\n" +
    "                <span class=\"postfix\">rows of {{browseCtrl.table.pagination.total}}</span>\n" +
    "            </div>\n" +
    "            <div class=\"columns large-2 medium-2 small-2 left\">\n" +
    "                <span class=\"button postfix\" ng-click=\"browseCtrl.loadTable()\">Go</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"columns small-12\">\n" +
    "        <div ng-show=\"browseCtrl.table.pagination.pages > 1\">\n" +
    "            <cf-pagination pagination=\"browseCtrl.table.pagination\" callback=\"browseCtrl.changePage\"></cf-pagination>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"columns small-12\">\n" +
    "        <table>\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th ng-repeat=\"field in browseCtrl.table.fields\">\n" +
    "                    {{field.name}}\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"row in browseCtrl.table.rows\">\n" +
    "                <td ng-repeat=\"cell in row\">\n" +
    "                    {{cell.value}}\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/cf-templates/Databases.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Databases.html",
    "<div class=\"row\">\n" +
    "    <h2>Databases</h2>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"btn-group\" role=\"group\">\n" +
    "    <button type=\"button\" class=\"btn btn-primary\">Create Database</button>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"btn-group\" role=\"group\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" ng-class=\"{active:main.settings.viewType == 'grid'}\" ng-click=\"main.settings.viewType = 'grid'\">Grid View</button>\n" +
    "    <button type=\"button\" class=\"btn btn-default\" ng-class=\"{active:main.settings.viewType != 'grid'}\" ng-click=\"main.settings.viewType = 'list'\">List View</button>\n" +
    "</div>\n" +
    "\n" +
    "<ul>\n" +
    "    <li ng-repeat=\"(name, param) in databaseCtrl.params\">\n" +
    "        <pre>{{name}} = {{param}}</pre>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "\n" +
    "<div ng-show=\"main.settings.viewType == 'grid'\" class=\"row\">\n" +
    "\n" +
    "    <div class=\"columns small-12\">\n" +
    "        <div class=\"large-4 small-6 columns left cf-grid-box\" ng-repeat=\"database in databaseCtrl.databases\">\n" +
    "            <div class=\"row\">\n" +
    "                <h4 class=\"cf-db-name\"><a href=\"Databases/{{database.name}}/Tables\"></a>{{database.name}}</h4>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <h5 class=\"cf-db-table-count\">{{database.tableCount}} tables</h5>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"columns small-6 text-center\">\n" +
    "                    <a href=\"Databases/{{database.name}}/Tables\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-edit\"></i></a>\n" +
    "                </div>\n" +
    "                <div class=\"columns small-6 text-centers\">\n" +
    "                    <i class=\"fi-x\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"main.settings.viewType != 'grid'\" class=\"row\">\n" +
    "\n" +
    "    <div class=\"columns medium-6\">\n" +
    "        <table class=\"table table-striped\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th width=\"350\">Database</th>\n" +
    "                <th width=\"50\" class=\"text-center\">Tables</th>\n" +
    "                <th width=\"50\"></th>\n" +
    "                <th width=\"50\"></th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"database in databaseCtrl.databases\">\n" +
    "                <td>{{database.name}}</td>\n" +
    "                <td class=\"text-center\">{{database.tableCount}}</td>\n" +
    "                <td class=\"text-center\"><a href=\"Databases/{{database.name}}/Tables\"><i class=\"glyphicon glyphicon-edit\"></i></a></td>\n" +
    "                <td class=\"text-center\"><i class=\"fi-x\"></i></td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("/cf-templates/Fields.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Fields.html",
    "<div class=\"row\" ng-show=\"fieldCtrl.fields\">\n" +
    "    <div class=\"columns small-12\">\n" +
    "        <h2 class=\"text-center-screen\">Viewing structure of {{fieldCtrl.navigation.params.table}} table in {{fieldCtrl.navigation.params.database}} database</h2>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"columns medium-6\">\n" +
    "                <a href=\"/Databases/{{fieldCtrl.navigation.params.database}}/Tables/\" class=\"button expand left\"><i class=\"fi-arrow-left\"></i> Back to {{fieldCtrl.navigation.params.database}} tables</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"columns large-6\">\n" +
    "                <table>\n" +
    "                    <thead>\n" +
    "                    <th width=\"300\">Name</th>\n" +
    "                    <th width=\"300\">Type</th>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                    <tr ng-repeat=\"field in fieldCtrl.fields\">\n" +
    "                        <td>{{field.name}}</td>\n" +
    "                        <td>{{field.type}}</td>\n" +
    "                    </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/cf-templates/Log-In.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Log-In.html",
    "<h1>Log In</h1>\n" +
    "\n" +
    "<div ng-show=\"!main.auth.loggedIn\">\n" +
    "    <p>This is a temporary login form, just use the sample credentials provided for now.</p>\n" +
    "\n" +
    "\n" +
    "    <form ng-submit=\"loginCtrl.login()\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"username\">Username : </label>\n" +
    "            <input type=\"username\" id=\"username\" class=\"form-control\" ng-model=\"loginCtrl.username\" placeholder=\"USername\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"password\">Password : </label>\n" +
    "            <input type=\"password\" id=\"password\" class=\"form-control\" ng-model=\"loginCtrl.password\" placeholder=\"Password\">\n" +
    "        </div>\n" +
    "\n" +
    "        <button class=\"btn btn-primary\">Log in</button>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div ng-show=\"main.auth.loggedIn\">\n" +
    "    <p>You are now logged in :)</p>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/cf-templates/Tables.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Tables.html",
    "<div class=\"row\">\n" +
    "    <div class=\"columns small-12\">\n" +
    "        <h2 class=\"text-center-screen\">{{tableCtrl.navigation.params.database}} tables</h2>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"tableCtrl.tables\" class=\"row\">\n" +
    "\n" +
    "    <div class=\"columns medium-6\">\n" +
    "        <table class=\"table table-striped cf-table-list\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th width=\"300\">Table</th>\n" +
    "                <th width=\"50\" class=\"text-center\">Structure</th>\n" +
    "                <th width=\"50\" class=\"text-center\">Browse</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"table in tableCtrl.tables\">\n" +
    "                <td>{{table.name}}</td>\n" +
    "                <td class=\"text-center\"><a class=\"btn btn-default\" href=\"/Databases/{{tableCtrl.navigation.params.database}}/Tables/{{table.name}}/\"><i class=\"glyphicon glyphicon-list\"></i></a></td>\n" +
    "                <td class=\"text-center\"><a class=\"btn btn-default\" href=\"/Databases/{{tableCtrl.navigation.params.database}}/Tables/{{table.name}}/browse/\"><i class=\"glyphicon glyphicon-eye-open\"></i></a></td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<ul>\n" +
    "    <li ng-repeat=\"(name, param) in tableCtrl.navigation.params\">\n" +
    "        <pre>{{name}} = {{param}}</pre>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("/cf-templates/directives/cf-pagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/directives/cf-pagination.html",
    "<div>\n" +
    "    <ul class=\"pagination\">\n" +
    "        <li class=\"arrow\" ng-class=\"{unavailable: ctrl.pagination.page == 1}\">\n" +
    "            <a ng-click=\"ctrl.selectPage(ctrl.pagination.page - 1)\"><i class=\"glyphicon glyphicon-chevron-left\"></i></a>\n" +
    "        </li>\n" +
    "        <li ng-repeat=\"number in ctrl.pagination.numbers\" ng-class=\"{current: number == ctrl.pagination.page}\">\n" +
    "            <a ng-click=\"ctrl.selectPage(number)\">{{number}}</a>\n" +
    "        </li>\n" +
    "        <li class=\"arrow\" ng-class=\"{unavailable: ctrl.pagination.page >= ctrl.pagination.pages}\">\n" +
    "            <a ng-click=\"ctrl.selectPage(ctrl.pagination.page + 1)\"><i class=\"glyphicon glyphicon-chevron-right\"></i></a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
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

    ctrl.username = 'demoUser'
    ctrl.password = '123456789'

    ctrl.login = function(){
        AuthService.login({
            username: ctrl.username,
            password: ctrl.password
        });
        if(AuthService.isLoggedIn( false ) == true){
            $location.url('/Databases/')
        }
    }
};
