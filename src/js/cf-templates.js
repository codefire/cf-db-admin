angular.module('cf-templates', ['/cf-templates/Browse.html', '/cf-templates/Databases.html', '/cf-templates/Fields.html', '/cf-templates/Log-In.html', '/cf-templates/Tables.html', '/cf-templates/directives/cf-pagination.html']);

angular.module("/cf-templates/Browse.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Browse.html",
    "<h1>Browse</h1>\n" +
    "\n" +
    "<div ng-show=\"browseCtrl.table\">\n" +
    "\n" +
    "    <p>Browsing table : <strong>{{browseCtrl.table.name}}</strong> - showing <strong>{{browseCtrl.table.pagination.showing}}</strong> rows of <strong>{{browseCtrl.table.pagination.total}}</strong></p>\n" +
    "\n" +
    "    <div ng-show=\"browseCtrl.table.pagination.pages > 1\">\n" +
    "        <cf-pagination pagination=\"browseCtrl.table.pagination\" callback=\"browseCtrl.changePage\"></cf-pagination>\n" +
    "    </div>\n" +
    "\n" +
    "    <table border=\"1\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th ng-repeat=\"field in browseCtrl.table.fields\">\n" +
    "                    {{field.name}}\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-repeat=\"row in browseCtrl.table.rows\">\n" +
    "                <td ng-repeat=\"cell in row\">\n" +
    "                    {{cell.value}}\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "</div>");
}]);

angular.module("/cf-templates/Databases.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Databases.html",
    "<div class=\"row squeeze-up push-down\">\n" +
    "    <div class=\"columns large-6\">\n" +
    "        <!--<ul>-->\n" +
    "            <!--<li>debug : {{databaseCtrl.debug}}</li>-->\n" +
    "        <!--</ul>-->\n" +
    "        <a href=\"#\" class=\"button left\"><i class=\"fi-plus\"></i> Create Database</a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"columns large-6\">\n" +
    "        <a href=\"#\" ng-click=\"gridView=true\" class=\"button right\"><i class=\"fi-thumbnails\"></i> Grid View</a>\n" +
    "        <a href=\"#\" ng-click=\"gridView=false\" class=\"button right\"><i class=\"fi-list\"></i> List View</a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<ul>\n" +
    "    <li ng-repeat=\"(name, param) in databaseCtrl.params\">\n" +
    "        <pre>{{name}} = {{param}}</pre>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "\n" +
    "<div ng-show=\"gridView\">\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "        <div class=\"large-3 small-6 columns left cf-grid-box\" ng-repeat=\"database in databaseCtrl.databases\">\n" +
    "            <div class=\"row\">\n" +
    "            <h4 class=\"cf-db-name\"><a href=\"Databases/{{database.name}}/Tables\"></a>{{database.name}}</h4>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "            <h5 class=\"cf-db-table-count\">{{database.tableCount}} tables</h5>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"small-6 columns\">\n" +
    "                    <a href=\"Databases/{{database.name}}/Tables\"><i class=\"fi-pencil\"></i></a>\n" +
    "                </div>\n" +
    "                <div class=\"small-6 columns\">\n" +
    "                    <i class=\"fi-x\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <h5 class=\"primary-color\">The idea is that users would be able to colour code their databases in their own colours if they wanted :)</h5>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"!gridView\">\n" +
    "        <table>\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th width=\"350\">Database</th>\n" +
    "                <th width=\"100\" class=\"text-center\">Tables</th>\n" +
    "                <th width=\"150\"></th>\n" +
    "                <th width=\"150\"></th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"database in databaseCtrl.databases\">\n" +
    "                <td>{{database.name}}</td>\n" +
    "                <td class=\"text-center\">{{database.tableCount}}</td>\n" +
    "                <td class=\"text-center\"><a href=\"Databases/{{database.name}}/Tables\"><i class=\"fi-pencil\"></i></a></td>\n" +
    "                <td class=\"text-center\"><i class=\"fi-x\"></i></td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "\n" +
    "    <h5 class=\"primary-color\">This is the boring standard view. Users will be able to choose which view to load on default. Click the grid button!</h5>\n" +
    "</div>\n" +
    "\n" +
    "<script>\n" +
    "    $(document).foundation();\n" +
    "</script>");
}]);

angular.module("/cf-templates/Fields.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Fields.html",
    "<h2>Fields template</h2>\n" +
    "<ul>\n" +
    "    <li>debug : {{fieldCtrl.debug}}</li>\n" +
    "</ul>\n" +
    "\n" +
    "<div ng-show=\"fieldCtrl.fields\">\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"field in fieldCtrl.fields\">\n" +
    "           {{field.name}} - {{field.type}}\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/cf-templates/Log-In.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Log-In.html",
    "<h1>Log In</h1>\n" +
    "\n" +
    "<div ng-show=\"!main.auth.loggedIn\">\n" +
    "    <p>This is a temporary login form, just use the sample credentials provided for now.</p>\n" +
    "    <ul>\n" +
    "        <li>\n" +
    "            <label for=\"username\">Username : </label>\n" +
    "            <input type=\"text\" id=\"username\" ng-model=\"loginCtrl.username\"/>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <label for=\"password\">Password : </label>\n" +
    "            <input type=\"password\" id=\"password\" ng-model=\"loginCtrl.password\"/>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <button class=\"button\" ng-click=\"loginCtrl.login()\">Log in</button>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"main.auth.loggedIn\">\n" +
    "    <p>You are now logged in :)</p>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/cf-templates/Tables.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Tables.html",
    "<h2>Tables template</h2>\n" +
    "<ul>\n" +
    "    <li>debug : {{tableCtrl.debug}}</li>\n" +
    "</ul>\n" +
    "\n" +
    "<div ng-show=\"tableCtrl.tables\">\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"table in tableCtrl.tables\">\n" +
    "            {{table.name}} -\n" +
    "            <a href=\"/Databases/{{tableCtrl.navigation.params.database}}/Tables/{{table.name}}/\">Structure</a>\n" +
    "            -\n" +
    "            <a href=\"/Databases/{{tableCtrl.navigation.params.database}}/Tables/{{table.name}}/browse/\">Browse</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
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
    "            <a ng-click=\"ctrl.selectPage(ctrl.pagination.page - 1)\">&laquo;</a>\n" +
    "        </li>\n" +
    "        <li ng-repeat=\"number in ctrl.pagination.numbers\" ng-class=\"{current: number == ctrl.pagination.page}\">\n" +
    "            <a ng-click=\"ctrl.selectPage(number)\">{{number}}</a>\n" +
    "        </li>\n" +
    "        <li class=\"arrow\" ng-class=\"{unavailable: ctrl.pagination.page >= ctrl.pagination.pages}\">\n" +
    "            <a ng-click=\"ctrl.selectPage(ctrl.pagination.page + 1)\">&raquo;</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);
