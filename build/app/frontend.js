(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("app.routes.IndexRoute",["realm.riot.Router", "app.routes.PlaceRoute", "app.routes.TestRoute", "app.routes.UserRoute"],function(Router, PlaceRoute, TestRoute, UserRoute){ var $_exports;

class IndexRoute extends Router {

   initialize() {
      console.log('IndexRoute initialize');
      this.title = "Hello i am title";
      return this.render('landing', function(tag) {

      });
   }

   onTest() {
      return new TestRoute();
   }

   onPlace(id) {
      console.log('IndexRoute onPlace');
      return new PlaceRoute();
   }
   onUser() {
      console.log('IndexRoute onUser');
      return new UserRoute();
   }
}

$_exports = IndexRoute

return $_exports;
});
realm.module("app.routes.PlaceDetails",["realm.riot.Router"],function(Router){ var $_exports;

class PlaceDetails extends Router {

   initialize(placeId) {
      console.log("PlaceDetails initialize")
      return this.render('place-details', function(tag) {

      });
   }

   onPukka() {
      console.log("PlaceDetails onPukka")
      return this.render('place-tab', function() {

      });
   }
}

$_exports = PlaceDetails

return $_exports;
});
realm.module("app.routes.PlaceRoute",["realm.riot.Router", "app.routes.PlaceDetails"],function(Router, PlaceDetails){ var $_exports;
class PlaceRoute extends Router {

   initialize(placeId) {
      console.log("PlaceRoute initialize", placeId);
      return this.render('place-index', function() {
         var details = new PlaceDetails();
         details.place = "hello my place is here";
         return details;
      });
   }
}

$_exports = PlaceRoute

return $_exports;
});
realm.module("app.routes.TestRoute",["realm.riot.Router", "app.routes.PlaceRoute", "app.routes.UserRoute"],function(Router, PlaceRoute, UserRoute){ var $_exports;

class TestRoute extends Router {

   initialize() {

      return this.render('test-route');
   }
   onHello() {
      return this.render('hello');
   }
}

$_exports = TestRoute

return $_exports;
});
realm.module("app.routes.UserRoute",["realm.riot.Router"],function(Router){ var $_exports;

class UserRoute extends Router {

   initialize() {
      console.log("UserRoute initialize")
      return this.render('user-index')
   }
   onActive() {
      console.log("UserRoute onActive");
      return this.render('user-active')
   }
}

$_exports = UserRoute

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());