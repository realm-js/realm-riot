"use realm backend";
import Express from realm.server;

class Server extends Express {

   configure() {
      this.port = 5001;
      this.serve("/dependencies/", "@default");
      this.serve("/build/", "@home/build");

      this.serve("/lib/riot", "@home/node_modules/riot/");
      this.serve("/static", "@home/static/");

      this.addScripts([
         '/dependencies/lodash.min.js',
         '/dependencies/realm.js',
         '/dependencies/realm.router.js',
         '/lib/riot/riot.min.js',

         '/build/riot-tags.js',
         '/build/frontend.js',

         '/build/universal.js',
         '/build/app/frontend.js',
         '/build/app/universal.js'
      ]);

      this.addStyles(['/static/css/main.css', '/static/css/semantic.min.css']);

      this.bindIndex(/^\/(?!api|_realm_|favicon.ico).*/, {
         application: 'app.Application',
         title: "Test Application"
      });

      this.start();
   }
}
export Server
