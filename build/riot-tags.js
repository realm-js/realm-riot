(function(___scope___) { "use strict"; var $isBackend = ___scope___.isNode; var realm  = ___scope___.realm;

riot.tag2('index', '<div class="ui borderless main menu"><div class="ui text container"><div href="/" class="header item"> Realm riot </div><a href="/todo" class="item {active : opts.route.activeTab === \'todo\'}">ToDo</a><a href="/profile/test-user" class="item">Profile</a></div></div><div route class="ui text container"></div>', '', '', function(opts) {
      var route = this.route = opts.route;
});

realm.module("app.tags.todo",["app.services.ToDo"],function(toDoService){ var $_exports;
riot.tag2('todo', '<h2>Todo</h2><table class="ui compact celled definition table"><thead><tr><th></th><th width="20">id</th><th>Title</th></tr></thead><tbody><tr each="{item in list}" class="{active : item.done}"><td class="collapsing"><input type="checkbox" __checked="{item.done}" onclick="{parent.toggleDone}"></td><td>{item.id}</td><td>{item.title}</td></tr></tbody><tfoot class="full-width"><tr><th></th><th colspan="4"><form class="ui form" onsubmit="{addToDo}"><div class="field"><input type="text" name="newTodo" placeholder="What\'s on you mind?"></div><div class="ui right floated small primary labeled icon button"><i class="icon plus"></i> Add todo </div></form></th></tr></tfoot></table>', '', '', function(opts) {

      var self = this;


      this.getList = function () {
         toDoService.getList().then(function (result) {
            self.list = result;
            self.update();
         })
      }
      this.toggleDone = function (e) {
         var todo = e.item.item;
         todo.done = todo.done
            ? false
            : true;
         toDoService.save(todo);
      }

      this.addToDo = function () {
         if (self.newTodo.value) {
            toDoService.add(self.newTodo.value).then(function (data) {
               self.list.push(data);
               self.update();
            });
         }
      }

      this.getList();
});

return $_exports;
});
riot.tag2('profile-index', '<h2>Profile {user}</h2><div route></div>', '', '', function(opts) {
});

riot.tag2('profile-tabs', '<div class="ui pointing secondary menu"><a class="item {active : active === \'first\'}" href="/profile/{user}/first">First</a><a class="item {active : active === \'second\'}" href="/profile/{user}/second">Second</a><a class="item {active : active === \'third\'}" href="/profile/{user}/third">Third</a></div><div class="ui tab segment active" route></div>', '', '', function(opts) {
});

riot.tag2('profile-first', '<h3>First</h3>', '', '', function(opts) {
});

riot.tag2('profile-second', '<h3>Second</h3>', '', '', function(opts) {
});

riot.tag2('profile-third', '<h3>Third</h3>', '', '', function(opts) {
});


})(function(self){ var isNode = typeof exports !== 'undefined'; return { isNode : isNode, realm : isNode ? require('realm-js') : window.realm}}());