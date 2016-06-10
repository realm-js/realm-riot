"use realm frontend";
import Router from realm.riot;
import PlaceDetails from app.routes;
class PlaceRoute extends Router {

   initialize(placeId) {
      console.log("PlaceRoute initialize", placeId);
      return this.render('place-index', function() {
         var details = new PlaceDetails();
         details.place = "hello my place is here";
         return details;
      });
   }
}
export PlaceRoute
