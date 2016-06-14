(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.services.ToDo",["realm.router.BridgeRequest"],function(BridgeRequest){ var $_exports;
$_exports = {
'add': function(){return BridgeRequest.connect("app.services.ToDo", "add", arguments)},
'save': function(){return BridgeRequest.connect("app.services.ToDo", "save", arguments)},
'getList': function(){return BridgeRequest.connect("app.services.ToDo", "getList", arguments)}
}
return $_exports;
});
realm.module("app.routes.IndexRoute",["realm.riot.Router", "app.routes.TodoRoute", "app.routes.ProfileRoute"],function(Router, TodoRoute, ProfileRoute){ var $_exports;

class IndexRoute extends Router {

   initialize() {
      var self = this;
      return this.render('index');
   }
   onTodo() {
      return new TodoRoute();
   }
   onProfile(id) {
      return new ProfileRoute(id);
   }

}

$_exports = IndexRoute

return $_exports;
});
realm.module("app.routes.ProfileRoute",["realm.riot.Router", "app.routes.ProfileTabsRoute"],function(Router, ProfileTabsRoute){ var $_exports;


class ProfileRoute extends Router {
   constructor(user) {
      super();
      this.user = user;
   }
   initialize() {
      return this.render('profile-index', function(tag) {
         tag.user = this.user
         tag.update();
         return new ProfileTabsRoute(this.user);
      })

   }
}


$_exports = ProfileRoute;

return $_exports;
});
realm.module("app.routes.ProfileTabsRoute",["realm.riot.Router"],function(Router){ var $_exports;

class ProfileTabsRoute extends Router {
   constructor(user) {
      super();
      this.user = user;
   }

   initialize() {
      return this.render('profile-tabs', function(tabs) {
         this.tabs = tabs;
         tabs.user = this.user
         tabs.update();
      });
   }

   updateSelected(name) {
      this.profileTabs.active = name;
      this.profileTabs.update();
   }

   onFirst() {
      return this.render('profile-first', function() {
         this.updateSelected('first');
      });
   }

   onSecond() {
      return this.render('profile-second', function() {
         this.updateSelected('second');
      });
   }

   onThird() {
      return this.render('profile-third', function() {
         this.updateSelected('third');
      });
   }
}


$_exports = ProfileTabsRoute;

return $_exports;
});
realm.module("app.routes.TodoRoute",["realm.riot.Router"],function(Router){ var $_exports;

class TodoRoute extends Router {
   initialize() {
      return this.render('todo');
   }
}


$_exports = TodoRoute;

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());