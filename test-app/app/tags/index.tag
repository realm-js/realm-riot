<index>
   <div class="ui borderless main menu">
      <div class="ui text container">
         <div href="/" class="header item">

            Realm riot
         </div>
         <a href="/todo" class="item {active : opts.route.activeTab === 'todo'}">ToDo</a>
         <a href="/profile/test-user" class="item">Profile</a>

      </div>
   </div>

   <div route class="ui text container"></div>
   <script>
      var route = this.route = opts.route;
   </script>
</index>
