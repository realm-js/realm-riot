(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("realm.riot.Dispatcher",["utils.lodash", "realm.riot.PushState"],function(_, PushState){ var $_exports;


var $rootRoute;

var url2Method = function(url) {
   return "on" + url[0].toUpperCase() + url.slice(1, url.length);
}

class Dispatcher {

   /**
    * constructor -
    * Subscribes to changes (Should be initialated only once)
    *
    * @return {type}  description
    */
   constructor() {
      var self = this;
      this.states = {};
      this.urls = [];

      PushState.subscribe(function() {
         self.changed();
      });
   }

   /**
    * storeEssentials - stores information into the "route" object
    * Creats a hidden proprety
    * @param  {type} obj  description
    * @param  {type} data description
    * @return {type}      description
    */
   storeEssentials(obj, data) {
      if (!obj.$$router) {
         Object.defineProperty(obj, "$$router", {
            enumerable: false,
            value: data
         });
         return obj.$$router;
      } else {

         _.each(data, function(v, k) {

            obj.$$router[k] = v;
         });
      }
      return obj.$$router;
   }

   assign(route) {
      if (!$rootRoute) {
         $rootRoute = route;
      }
      this.changed();
   }

   /**
    * getEssentials - gets information from an object
    *
    * @param  {type} obj description
    * @return {type}     description
    */
   getEssentials(obj) {
      return obj.$$router || {};
   }

   /**
    * getPaths - Retrevies paths
    *
    * @return {type}  description
    */
   getPaths() {
      var path = window.location.pathname;
      return path.split("/")
   }

   getFullURL() {
      return window.location.href;
   }

   /**
    * register - description
    *
    * @param  {type} element description
    * @param  {type} route   description
    * @return {type}         description
    */
   register(element, tag, route) {
      var self = this;

      var essentials = self.storeEssentials(route, {
         element: element
      });

      var nextIndex = essentials.index + 1;
      var path = this.paths[essentials.index + 1];
      var args = _.slice(this.paths, essentials.index + 2);
      while (element.firstChild) {
         element.removeChild(element.firstChild);
      }
      if (!path) {
         return;
      }

      var method = route[url2Method(path)];

      if (_.isFunction(method)) {
         var result = this.evaluate(route, method, args);
         var element = route.$$router.element;
         if (_.isPlainObject(result)) {
            self.mount(element, result, true);
         } else {
            self.initializeRoute(element, result, nextIndex, args);
         }
      }
   }

   /**
    * changed - description
    *
    * @return {type}  description
    */
   changed() {
      var self = this;
      this.paths = this.getPaths();

      if (!this.root) { // initial run
         self.urls = this.paths;
         return this.createRoot();
      }
      // on navigation
      var changedRoute;
      _.each(this.paths, function(path, index) {
         if (self.urls[index] !== path && changedRoute === undefined) {
            changedRoute = index;
         }
      });
      //console.log(self.fullURL !== self.getFullURL())
      if (changedRoute === undefined && self.paths.length !== self.urls.length) {
         changedRoute = _.findLastIndex(this.paths);
      }
      if (changedRoute > -1) {
         var route = self.states[changedRoute - 1];
         if (route !== undefined) {
            if (route.$$router) {
               var routerData = route.$$router;
               if (routerData.element && routerData.data) {
                  self.register(routerData.element, routerData.data.tag, routerData.data.parent);
               }
            }
         }
      }
      self.fullURL = self.getFullURL();
      self.urls = this.paths;
   }

   /**
    * initializeRoute - description
    *
    * @param  {type} route     description
    * @param  {type} nextIndex description
    * @return {type}           description
    */
   initializeRoute(element, route, nextIndex, args) {
      var self = this;
      self.storeEssentials(route, {
         index: nextIndex,
         dispatcher: self,
         element: element
      });
      self.states[nextIndex] = route;
      var data = this.evaluate(route, route.initialize, args);
      if (data) {
         var furtherDown = self.mount(element, data);
         if (furtherDown.nextElement) {
            var furtherIndex = nextIndex + 1;
            var furtherArgs = _.slice(this.paths, furtherIndex);

            if (furtherDown.result && furtherDown.nextElement) {
               self.initializeRoute(furtherDown.nextElement, furtherDown.result, furtherIndex, furtherArgs)
            }
         }
      }
   }

   /**
    * createRoot - description
    *
    * @return {type}  description
    */
   createRoot() {
      var self = this;
      this.root = new $rootRoute();
      self.storeEssentials(this.root, {
         index: 0,
         dispatcher: self
      });
      self.states[0] = this.root;
      var data = this.evaluate(this.root, this.root.initialize);
      self.mount('body', data)

   }

   patchLinks(element) {
      var links = element.querySelectorAll('a');
      _.each(links, function(link) {
         link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            PushState.force({}, this.getAttribute('href'));
         })
      });
   }

   mount(element, data, deadEnd) {
      var self = this;
      var tag = riot.mount(element, data.tag, {
         route: data.parent
      });
      var targetTag = tag[0];
      if (!deadEnd) {
         self.patchLinks(targetTag.root);
         var mountTarget = targetTag.root.querySelector("*[route]");
         if (mountTarget) {
            data.parent.$$router.data = data;
            self.register(mountTarget, targetTag, data.parent)
         }
      }
      return {
         result: data.callback ? data.callback.apply(data.parent, [targetTag]) : undefined,
         nextElement: mountTarget
      }
   }

   /**
    * evaluate - checks the response
    *
    * @param  {type} result description
    * @return {type}        description
    */
   evaluate(route, method, args) {
      var index = route.$$router.index;
      var result = method.apply(route, args || [])
      return result;
   }
}

let dispatcher = new Dispatcher();

$_exports = dispatcher;

return $_exports;
});
realm.module("realm.riot.PushState",["realm.riot.Query", "utils.lodash"],function(Query, _){ var $_exports;


var subscriptions = [];

class PushState {

   static _createQueryString(data) {
      var stringData = [];
      _.each(data, function(value, k) {
         stringData.push(k + "=" + encodeURI(value))
      });
      var str = stringData.join("&");
      if (stringData.length > 0) {
         str = "?" + str;
      }
      return str;
   }
   static subscribe(cb) {
      subscriptions.push(cb);

   }
   static changed() {
      _.each(subscriptions, function(cb) {
         cb();
      });
   }

   static redirect(url) {
      History.set(url);
   }

   static get(item) {
      var q = Query.get();
      if (item) {
         return q[item];
      }
      return q;
   }

   static _changeState(a) {
      var stateObj = {
         url: a
      };
      history.pushState(stateObj, a, a);
      PushState.changed();
   }

   static force(data, userUrl) {
      this._changeState((userUrl || window.location.pathname) + this._createQueryString(data));
   }

   static merge(data, userUrl) {
      if (_.isPlainObject(data)) {
         var current = Query.get();
         var params = _.merge(current, data);
         var url = (userUrl || window.location.pathname) + this._createQueryString(params);
         this._changeState(url);
      }
   }
}

window.onpopstate = function(state) {
   PushState.changed();
}


$_exports = PushState;

return $_exports;
});
realm.module("realm.riot.Query",[],function(){ var $_exports;

class Query {
   static get() {
      // This function is anonymous, is executed immediately and
      // the return value is assigned to QueryString!
      var query_string = {};
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
         var pair = vars[i].split("=");
         // If first entry with this name
         if (typeof query_string[pair[0]] === "undefined") {

            if (pair[0]) {
               query_string[pair[0]] = decodeURIComponent(pair[1]);
            }

            // If second entry with this name
         } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
         } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
         }
      }
      return query_string;
   }
}


$_exports = Query;

return $_exports;
});
realm.module("realm.riot.Router",["realm.riot.Dispatcher", "utils.lodash"],function(dispatcher, _){ var $_exports;

class Router {

   static start() {
      dispatcher.assign(this);
   }

   render(target, callback) {

      return {
         parent: this,
         type: "router",
         tag: target,
         callback: callback
      }

   }
}

$_exports = Router;

return $_exports;
});
"use realm frontend-raw";

realm.module("utils.lodash", function() {
   return window._;
});


})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());