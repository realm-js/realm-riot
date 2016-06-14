"use realm";
import IndexRoute from app.routes;

class Application {
   static main() {
      var packages = ['realm.tags', 'app.tags'];
      realm.each(packages, function(_p) {
         return realm.requirePackage(_p)
      }).then(function() {
         IndexRoute.start();
      });
   }
}

export Application;
