"use realm frontend";
import Router from realm.riot;

class TodoRoute extends Router {
   initialize() {
      return this.render('todo');
   }
}

export TodoRoute;
