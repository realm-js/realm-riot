"use realm frontend";
import Router from realm.riot;
import PlaceRoute, UserRoute from app.routes;

class TestRoute extends Router {

   initialize() {

      return this.render('test-route');
   }
   onHello() {
      return this.render('hello');
   }
}
export TestRoute
