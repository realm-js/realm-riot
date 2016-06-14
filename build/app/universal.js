(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.Application",["app.routes.IndexRoute"],function(IndexRoute){ var $_exports;

class Application {
   static main() {
      var packages = ['realm.tags', 'app.tags'];
      realm.each(packages, function(_p) {
         return realm.requirePackage(_p)
      }).then(function() {
         IndexRoute.start();
      });
   }
}


$_exports = Application;

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());