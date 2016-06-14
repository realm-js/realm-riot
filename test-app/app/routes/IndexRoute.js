"use realm frontend";
import Router from realm.riot;
import TodoRoute, ProfileRoute from app.routes;

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
export IndexRoute
