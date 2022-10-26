class TagMap
 {
   constructor(htmlID) {
      this.lastID = 0;
      this.htmlID = htmlID;
      this.maxZoom = 20;
      this.initialLatitude = 51.505;
      this.initialLongitude = -0.09;
      this.mapImage = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      this.map = this.initMap();
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

   getMarkers()
   {
      fetch('/api/v1/TagGetMarkers').then(response =>{
         return response.json();
      }).then(data =>{
         data.forEach(m => {
            this.setMarker(m.id, m.latitude, m.longitude, m.message);
         });
      })
   }

   async createMarker(latitude, longitude, message)
   {
      let response = await fetch('/api/v1/TagCreateMarker', {
               headers: { "Content-Type": "application/json; charset=utf-8; " },
               method: 'POST',
               body: JSON.stringify({
                     Latitude: parseInt(latitude),
                     Longitude: parseInt(longitude),
                     Message: message
               })
         })
      
      let data = await response.text();
      // console.log(data);

      return JSON.parse(data);
   
   }

}

var tm = {};
function init()
{
   tm = new TagMap("map");
}
