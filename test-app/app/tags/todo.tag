<todo>
   <h2>Todo</h2>
   <table class="ui compact celled definition table">
      <thead>
         <tr>
            <th></th>
            <th width="20">id</th>
            <th>Title</th>
         </tr>
      </thead>
      <tbody>
         <tr each="{item in list}" class="{active : item.done}">
            <td class="collapsing">
               <input type="checkbox" checked={item.done} onclick={parent.toggleDone}/>

            </td>
            <td>{item.id}</td>
            <td>{item.title}</td>

         </tr>
      </tbody>
      <tfoot class="full-width">
         <tr>
            <th></th>
            <th colspan="4">

               <form class="ui form" onsubmit="{addToDo}">
                  <div class="field">
                     <input type="text" name="newTodo" placeholder="What's on you mind?">
                  </div>
                  <div class="ui right floated small primary labeled icon button">
                     <i class="icon plus"></i>
                     Add todo
                  </div>
               </form>

            </th>
         </tr>
      </tfoot>
   </table>

   <script>
      "use realm";

      var self = this;

      // this is the BACKEND service (its source code is hidden from browser!!!)
      import ToDo as toDoService from app.services;

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
   </script>

</todo>
