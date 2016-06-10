<ui-checkbox>
   <input id={$name} type="checkbox"/>
   <label style="cursor:pointer" for={$name} if={opts.label}>{opts.label}</label>

   <script>
      "use realm";

      import AngularModel from realm.riot;

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
   </script>
</ui-checkbox>
