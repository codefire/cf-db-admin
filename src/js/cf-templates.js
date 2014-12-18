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
