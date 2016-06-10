"use realm";
import IndexRoute from app.routes;

class Application {
   static main() {
      realm.requirePackage('realm.tags').then(function() {
         IndexRoute.start();
      });
   }
}

export Application;
