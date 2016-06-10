(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.Server",["realm.server.Express"],function(Express){ var $_exports;

class Server extends Express {

   configure() {
      this.port = 5001;
      this.serve("/dependencies/", "@default");
      this.serve("/build/", "@home/build");
      this.serve("/lib/riot", "@home/node_modules/riot/");
      
      this.addScripts([
         '/dependencies/lodash.min.js',
         '/dependencies/realm.js',
         '/dependencies/realm.router.js',
         '/lib/riot/riot.min.js',
         '/build/riot-tags.js',

         '/build/realm-ui-tags.js',
         '/build/frontend.js',
         '/build/app/frontend.js',
         '/build/app/universal.js'
      ]);

      this.bindIndex(/^\/(?!api|_realm_|favicon.ico).*/, {
         application: 'app.Application',
         title: "Booking solutions"
      });

      this.start();
   }
}

$_exports = Server

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());