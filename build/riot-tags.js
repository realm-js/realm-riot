(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

riot.tag2('hello', '<div> this is Hello </div>', '', '', function(opts) {
});

riot.tag2('landing', '<h1>Hello world {user.name}</h1> asdf <form><ui-input model="user.name"></ui-input></form><div><a href="/">HOME</a></div><div><a href="/place/some-route-here/">To a place</a></div><div><a href="/place/some-route-here/pukka">To a place tab</a></div><div><a href="/user">To user</a></div><div><a href="/user/active">To active user</a></div><div><a href="/test">To TEST</a></div><div><a href="/test/hello">To test hello</a></div> Shit goes here:---><div route></div>', '', '', function(opts) {
      this.user = {
         name: "hello"
      }
      var self = this;
      this.on("model-changed", function (name, value) {
         self.update();
      });
});

riot.tag2('test-route', '<h1>TEST ROUTE!!</h1><div route style="border:1px solid black"></div>', '', '', function(opts) {
});

riot.tag2('user-active', '<h3>Active users</h3>', '', '', function(opts) {
});

riot.tag2('user-index', '<h2>User index</h2><div style="border:1px solid pink" route></div>', '', '', function(opts) {
});

riot.tag2('place-details', '<h2>this is place details</h2><div style="margin-left:100px; border:1px solid blue" route></div>', '', '', function(opts) {
});

riot.tag2('place-index', '<h2>this is place</h2><div style="border:1px solid red;" route></div>', '', '', function(opts) {
});

riot.tag2('place-tab', '<h2>this is place tab!!!</h2>', '', '', function(opts) {
});


})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());