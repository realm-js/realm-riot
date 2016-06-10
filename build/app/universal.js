(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.Application",["app.routes.IndexRoute"],function(IndexRoute){ var $_exports;

class Application {
   static main() {
      IndexRoute.start();
   }
}


$_exports = Application;

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());