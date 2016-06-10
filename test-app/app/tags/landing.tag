<landing>
   <h1>Hello world {user.name}</h1>
   asdf
   <form>
      <ui-input model="user.name"></ui-input>
   </form>
   <div>
      <a href="/">HOME</a>
   </div>
   <div>
      <a href="/place/some-route-here/">To a place</a>
   </div>
   <div>
      <a href="/place/some-route-here/pukka">To a place tab</a>
   </div>

   <div>
      <a href="/user">To user</a>
   </div>

   <div>
      <a href="/user/active">To active user</a>
   </div>

   <div>
      <a href="/test">To TEST</a>
   </div>
   <div>
      <a href="/test/hello">To test hello</a>
   </div>
   Shit goes here:--->
   <div route></div>
   <script>
      this.user = {
         name: "hello"
      }
      var self = this;
      this.on("model-changed", function (name, value) {
         self.update();
      });
   </script>
</landing>
