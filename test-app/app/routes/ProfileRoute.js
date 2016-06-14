"use realm frontend";
import Router from realm.riot;

import ProfileTabsRoute from app.routes;

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

export ProfileRoute;
