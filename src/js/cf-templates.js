angular.module('cf-templates', ['/cf-templates/Browse.html', '/cf-templates/Databases.html', '/cf-templates/Fields.html', '/cf-templates/Log-In.html', '/cf-templates/Tables.html']);

angular.module("/cf-templates/Browse.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/cf-templates/Browse.html",
    "<h1>Browse</h1>\n" +
    "\n" +
    "<div ng-show=\"browseCtrl.table\">\n" +
    "\n" +
    "    <p>Browsing table : <strong>{{browseCtrl.table.name}}</strong> - showing <strong>{{browseCtrl.table.meta.showing}}</strong> rows of <strong>{{browseCtrl.table.meta.total}}</strong></p>\n" +
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
    "<h2>Databases template</h2>\n" +
    "<ul>\n" +
    "    <li>debug : {{databaseCtrl.debug}}</li>\n" +
    "</ul>\n" +
    "\n" +
    "<div ng-show=\"databaseCtrl.databases\">\n" +
    "\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"database in databaseCtrl.databases\">\n" +
    "           <a href=\"/Databases/{{database.name}}/Tables/\">{{database.name}}</a>\n" +
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
