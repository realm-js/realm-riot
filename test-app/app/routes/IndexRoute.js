"use realm frontend";
import Router from realm.riot;
import PlaceRoute, TestRoute, UserRoute from app.routes;

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
export IndexRoute
