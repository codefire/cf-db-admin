angular.module('cf-templates', ['/cf-templates/Databases.html', '/cf-templates/Log-In.html', '/cf-templates/Tables.html']);

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
    "\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"table in tableCtrl.tables\">\n" +
    "           <a href=\"/Tables/{{table.name}}/\">{{table.name}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "<ul>\n" +
    "    <li ng-repeat=\"(name, param) in tableCtrl.params\">\n" +
    "        <pre>{{name}} = {{param}}</pre>\n" +
    "    </li>\n" +
    "</ul>");
}]);
