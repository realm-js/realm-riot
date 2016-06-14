"use realm frontend";

import lodash as _ from utils;
import PushState from realm.riot;

var $rootRoute;

var url2Method = function(url) {
   return "on" + url[0].toUpperCase() + url.slice(1, url.length);
}
var tagName2Variable = function(tagName) {
   var name = [];
   var nextUpperCase = false;
   _.each(tagName, function(symbol) {
      if (symbol === "-") {
         nextUpperCase = true;
      } else {
         if (nextUpperCase) {
            nextUpperCase = false;
            name.push(symbol.toUpperCase());
         } else {
            name.push(symbol);
         }
      }
   });
   return name.join('');
}
document.querySelector('body').addEventListener('click', function(e) {
   var target = e.target;
   if (target.nodeName === "A") {
      if (target.getAttribute('href')) {
         PushState.force({}, target.getAttribute('href'));
         e.preventDefault();
         e.stopPropagation();
      }
   }
})

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
   mount(element, data, deadEnd) {
      var self = this;
      var tag = riot.mount(element, data.tag, {
         route: data.parent
      });
      var targetTag = tag[0];
      if (!deadEnd) {
         var mountTarget = targetTag.root.querySelector("*[route]");
         if (mountTarget) {
            data.parent.$$router.data = data;
            var variableName = tagName2Variable(data.tag);
            data.parent[variableName] = targetTag;
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
export dispatcher;
