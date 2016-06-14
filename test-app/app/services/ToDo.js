"use realm bridge";
import lodash as _ from realm.server.utils;

var id = 0;
const list = [{
   title: "First thing",
   id: id++,
   done: false
}, {
   title: "Second thing",
   done: false,
   id: id++
}, {
   title: "Has to be done",
   id: id++,
   done: true
}];

class ToDo {

   static add(name) {
      var newToDo = {
         title: name,
         id: id++,
         done: false
      }
      list.push(newToDo)
      return newToDo;
   }

   static save(item) {
      var index = _.findIndex(list, {
         id: item.id
      });
      if (index > -1) {
         list[index] = item;
      }
      return item;
   }

   static getList() {
      return list;
   }
}

export ToDo;
