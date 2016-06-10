"use realm frontend";
import Dispatcher as dispatcher from realm.riot;
import lodash as _ from utils;

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
export Router;
