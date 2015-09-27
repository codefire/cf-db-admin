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
