"use realm frontend";
import Router from realm.riot;

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
export UserRoute
