"use realm frontend";
import Expressions as $expr from realm.riot;

class Model {
   constructor(tag) {
      this.tag = tag;
      this.path = tag.opts.model;

      this.model = $expr.compile(this.path);
      this.root = this.tag.root;
      var self = this;
      this.tag.on("update", function() {
         self._onUpdate.bind(self)();
      });
      this.tag.on("mount", function() {
         self._onMount.bind(self)();
      });
   }
   getValue() {
      return this.model(this.tag.parent);
   }
   assign(value) {
      this.model.assign(this.tag.parent, value);
   }
   onUpdate(fn) {
      this._onUpdate = fn;
   }

   onMount(fn) {
      this._onMount = fn;
   }

   notify(value) {
      this.tag.parent.trigger("model-changed", this.path, value)
   }

   attach(tag) {
      this.tag = tag;
   }
}

export Model;
