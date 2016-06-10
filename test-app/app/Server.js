"use realm backend";
import Express from realm.server;

class Server extends Express {

   configure() {
      this.port = 5001;
      this.serve("/dependencies/", "@default");
      this.serve("/build/", "@home/build");
      this.serve("/lib/riot", "@home/node_modules/riot/");

      this.addScripts([
         '/dependencies/lodash.min.js',
         '/dependencies/realm.js',
         '/dependencies/realm.router.js',
         '/lib/riot/riot.min.js',
         '/build/riot-tags.js',

         '/build/realm-ui-tags.js',
         '/build/frontend.js',
         '/build/app/frontend.js',
         '/build/app/universal.js'
      ]);

      this.bindIndex(/^\/(?!api|_realm_|favicon.ico).*/, {
         application: 'app.Application',
         title: "Booking solutions"
      });

      this.start();
   }
}
export Server
