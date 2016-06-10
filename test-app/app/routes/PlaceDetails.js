"use realm frontend";
import Router from realm.riot;

class PlaceDetails extends Router {

   initialize(placeId) {
      console.log("PlaceDetails initialize")
      return this.render('place-details', function(tag) {

      });
   }

   onPukka() {
      console.log("PlaceDetails onPukka")
      return this.render('place-tab', function() {

      });
   }
}
export PlaceDetails
