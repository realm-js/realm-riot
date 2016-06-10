<ui-textarea>
   <label if={opts.title}>{opts.title}</label>
   <textarea name="{opts.name}" placeholder="{opts.placeholder}"></textarea>
   <script>
      "use realm";

      import AngularModel from realm.riot;

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
   </script>
</ui-textarea>
