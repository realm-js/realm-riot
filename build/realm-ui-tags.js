(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

realm.module("realm.tags.form.ui-checkbox",["realm.riot.AngularModel"],function(AngularModel){ var $_exports;
riot.tag2('ui-checkbox', '<input id="{$name}" type="checkbox"><label style="cursor:pointer" for="{$name}" if="{opts.label}">{opts.label}</label>', '', '', function(opts) {

      var input = new AngularModel(this);
      this.$name = "id_" + new Date().getTime();
      input.$update = true;
      input.onUpdate(function () {
         var value = this.getValue();
         if (this.$update) {
            var input = this.root.querySelector('input');
            input.checked = value;
         } else {
            this.notify(value);
         }
      });
      input.onMount(function () {
         var self = this;
         var input = this.root.querySelector('input');
         input.addEventListener("click", function () {
            self.$update = false;
            self.assign(this.checked)
            self.notify(this.checked)
         });
      })
});

return $_exports;
});
realm.module("realm.tags.form.ui-input",["realm.riot.AngularModel"],function(AngularModel){ var $_exports;
riot.tag2('ui-input', '<label if="{opts.label}">{opts.label}</label><input type="text" name="{opts.name}" placeholder="{opts.placeholder}">', '', '', function(opts) {

      var input = new AngularModel(this);

      input.$update = true;
      input.onUpdate(function () {
         var value = this.getValue();
         if (this.$update) {
            var input = this.root.querySelector('input');
            input.value = value !== undefined
               ? value
               : '';
         } else {
            this.notify(value);
         }
      });
      input.onMount(function () {
         var self = this;
         var input = this.root.querySelector('input');
         input.addEventListener("keyup", function (e) {

            self.$update = false;
            self.assign(this.value);
            self.notify(this.value);
            if (e.keyCode === 13) {

               if (self.tag.opts.enter) {
                  self.tag.opts.enter.bind(self.tag.parent)();
               }
            }
         });
      });
});

return $_exports;
});
realm.module("realm.tags.form.ui-textarea",["realm.riot.AngularModel"],function(AngularModel){ var $_exports;
riot.tag2('ui-textarea', '<label if="{opts.title}">{opts.title}</label><textarea name="{opts.name}" placeholder="{opts.placeholder}"></textarea>', '', '', function(opts) {

      var input = new Model(this);

      input.$update = true;
      input.onUpdate(function () {
         var value = this.getValue();
         if (this.$update) {
            var input = this.root.querySelector('textarea');
            input.value = value !== undefined
               ? value
               : '';
         } else {
            this.notify(value);
         }
      });
      input.onMount(function () {
         var self = this;
         var input = this.root.querySelector('textarea');
         input.addEventListener("keyup", function () {
            self.$update = false;
            self.assign(this.value)
            self.notify(this.value)
         });
      })
});

return $_exports;
});

})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());