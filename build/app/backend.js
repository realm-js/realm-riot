(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.Server",["realm.server.Express"],function(Express){ var $_exports;

class Server extends Express {

   configure() {
      this.port = 5001;
      this.serve("/dependencies/", "@default");
      this.serve("/build/", "@home/build");


      this.serve("/lib/riot", "@home/node_modules/riot/");
      this.serve("/static", "@home/static/");

      this.addScripts([
         '/dependencies/lodash.min.js',
         '/dependencies/realm.js',
         '/dependencies/realm.router.js',
         '/lib/riot/riot.min.js',

         '/build/riot-tags.js',
         '/build/frontend.js',

         '/build/universal.js',
         '/build/app/frontend.js',
         '/build/app/universal.js'
      ]);

      this.addStyles(['/static/css/main.css', '/static/css/semantic.min.css']);

      this.bindIndex(/^\/(?!api|_realm_|favicon.ico).*/, {
         application: 'app.Application',
         title: "Test Application"
      });

      this.start();
   }
}

$_exports = Server

return $_exports;
});
realm.module("app.services.ToDo",["realm.server.utils.lodash"],function(_){ var $_exports;

var id = 0;
const list = [{
   title: "First thing",
   id: id++,
   done: false
}, {
   title: "Second thing",
   done: false,
   id: id++
}, {
   title: "Has to be done",
   id: id++,
   done: true
}];

class ToDo {

   static add(name) {
      var newToDo = {
         title: name,
         id: id++,
         done: false
      }
      list.push(newToDo)
      return newToDo;
   }

   static save(item) {
      var index = _.findIndex(list, {
         id: item.id
      });
      if (index > -1) {
         list[index] = item;
      }
      return item;
   }

   static getList() {
      return list;
   }
}


$_exports = ToDo;

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());