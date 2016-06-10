<ui-input>
   <label if={opts.label}>{opts.label}</label>
   <input type="text" name="{opts.name}" placeholder="{opts.placeholder}"/>

   <script>
      "use realm";

      import AngularModel from realm.riot;

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
   </script>
</ui-input>
