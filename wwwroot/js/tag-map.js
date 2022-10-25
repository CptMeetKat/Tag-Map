class TagMap
 {
   constructor(htmlID) {
      this.lastID = 0;
      this.htmlID = htmlID;
      this.maxZoom = 13;
      this.initialLatitude = 51.505;
      this.initialLongitude = -0.09;
      this.mapImage = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      this.map = this.initMap();
      // this.setExampleMarker();
      this.getMarkers();
   }

   initMap()
   {
      //Latitude then Longitude
      let map = L.map(this.htmlID).setView([this.initialLatitude, this.initialLongitude], 13);
      L.tileLayer(this.mapImage, {
         maxZoom: this.maxZoom,
         minZoom: 1
      }).addTo(map);   


      let onClick = async (e) => {
         let tag = prompt("Tag?");
         if(tag == null || tag == "")
            return;
         
         var response = await this.createMarker(e.latlng.lat, e.latlng.lng, tag);

         this.setMarker(response.id, e.latlng.lat, e.latlng.lng, tag);
      };
      map.on('click', onClick);

      return map;
   }

   sanitizeHTML(text) {
      var element = document.createElement('div');
      element.innerText = text;
      return element.innerHTML;
    }

   setMarker(id, lat, lng, message)
   {
      L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(this.createTitleDom(id) + this.sanitizeHTML(message))
      .openPopup();
   }

   createTitleDom(title)
   {
      return "<b>#" + title + "</b><br>";
   }

   nextID() {
      return ++(this.lastID);
   }

   // setMarkers(markers)
   // {
   //    markers.forEach(m => {
   //       this.setMarker(m.id, m.latitude, m.longitude, m.message);
   //    });
   // }

   getMarkers()
   {
      fetch('/api/v1/TagGetMarkers').then(response =>{
         return response.json();
      }).then(data =>{
         // this.setMarkers(data);
         data.forEach(m => {
            this.setMarker(m.id, m.latitude, m.longitude, m.message);
         });
      })
   }

   async createMarker(latitude, longitude, message)
   {
      let response = await fetch('/api/v1/TagCreateMarker', {
               headers: { "Content-Type": "application/json; charset=utf-8; " },
               // headers: { "Content-Type": "x-www-form-urlencoded; charset=utf-8" },
               method: 'POST',
               body: JSON.stringify({
                     // Id: 20199,
                     Latitude: parseInt(latitude),
                     Longitude: parseInt(longitude),
                     Message: message
               })
         })
      
      
      // let data = await response.json();
      let data = await response.text();
      console.log(data);
      // console.log(JSON.parse(data));
      // let parsedData = JSON.parse(data);

      return JSON.parse(data);
      // return {id: -1};
   
   }

}

var tm = {};
function init()
{
   tm = new TagMap("map");
   // tm.map.layerGroup.clearLayers();
}
