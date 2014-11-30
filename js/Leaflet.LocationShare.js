L.LocShare = {};
var note;
var LS = L.LocShare;
LS.Send = {};
LS.Send.Marker = {};
LS.Send.Popup = L.popup().setContent('<div><input id="sendText" type="text" style="border-color:#a7a7a7;border:solid;border-width:1px;border-radius:5px;height:30px;" size="30" onkeyup="L.LocShare.Send.UpdateMessage( this )" placeholder=""/></div><div style="height:35px;"><button style="border-style:solid;border-radius:5px;border-color:#3d94f6;float:right;color:white;background-color:#3d94f6;height:25px;font-size:15px;line-height:3px;margin:5px;" onclick="copyPrompt()">Compartir</button></div></div>');
LS.Receive = {};
LS.Receive.Marker = {};
LS.Receive.Popup = L.popup();
var sendIcon = L.icon({
  iconUrl: "images/marcador.png",
  iconSize:     [30, 30], // size of the icon
  iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
  popupAnchor:  [-4, -25]// point from which the popup should open relative to the iconAnchor
});

receiveIcon = L.icon({
  iconUrl: "images/marcador.png",
  iconSize:     [30, 30], // size of the icon
  iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
  popupAnchor:  [-4, -25] // point from which the popup should open relative to the iconAnchor
});

L.Map.addInitHook(function () {
  this.sharelocationControl = new L.Control.ShareLocation();
  this.addControl(this.sharelocationControl);
  this.whenReady( function(){
    populateMarker(this);
  })
});

L.Control.ShareLocation = L.Control.extend({
    options: {
        position: 'bottomleft',
        title: 'Dixar una nota'
    },
    onAdd: function () {
        var container = L.DomUtil.create('div', 'btnMain');

        this.link = L.DomUtil.create('a', 'leaflet-bar-part', container);
//        var userIcon = L.DomUtil.create('i', 'fa fa-users fa-lg', this.link);
        var userIcon = L.DomUtil.create('img' , 'img-responsive btnNotas' , this.link);
        userIcon.src = 'images/marcador.png';
        this.link.href = '#';

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
//        TODO: get location and putout url
      placeMarker( this._map )
    },
});



populateMarker = function (selectedMap) {
  // replace the line below with the results of any Url parser
  var intermediate = getJsonFromUrl()
  if ( isFinite(intermediate.lat) && isFinite(intermediate.lng) ){
    LS.Receive.message = intermediate.M;
    LS.Receive.lat = + intermediate.lat;
    console.log( intermediate.lat );
    LS.Receive.lng = + intermediate.lng; 
    console.log( intermediate.lng );
    var text = '<table><tr><td><p>' + LS.Receive.message + '</p></td><td><p>Lat: ' + LS.Receive.lat + '</p><p>Lng: ' + LS.Receive.lng + '</p></td></tr></table>';
//    LS.Receive.Popup.setContent(LS.Receive.message)
    LS.Receive.Marker = L.marker( [ LS.Receive.lat , LS.Receive.lng] , {icon:receiveIcon});
    console.log( LS.Receive.Marker._latlng );
    LS.Receive.Marker.bindPopup(LS.Receive.message);
    LS.Receive.Marker.addTo(selectedMap);
    LS.Receive.Marker.openPopup();
    selectedMap.setView({
      "lat": intermediate.lat,
      "lng": intermediate.lng
    },14)
  } 
}

function getJsonFromUrl () {
  var params = {};
  params.query = location.search.substr(1);
  params.parsed = decodeURIComponent( params.query );
  params.data = params.parsed.split("&");
  params.result = {};
  for(var i=0; i<params.data.length; i++) {
    var item = params.data[i].split("=");
    params.result[item[0]] = item[1];
  }
  // This will return all of the data in the query parameters in object form
  // getJsonFromUrl() only splits on ampersand and equals -- jquery can do better
  // But so could you!! submit a pull request if you've got one!
  return params.result;
}


// function copyPrompt() {
//   window.prompt("Aqui tens la teua nota, copia el link i comparteixlo on vullgues", '' + 
//                 location.origin + location.pathname + '?' + 
//                 'lat' + '=' + LS.Send.lat + '&' +
//                 'lng' + '=' + LS.Send.lng + '&' +
//                  'M' + '=' +  LS.Send.Message)
// }

function copyPrompt() {
  var el = document.getElementById('btnNotas');
  note = location.origin + location.pathname + '?' + 
    'lat' + '=' + LS.Send.lat + '&' +
    'lng' + '=' + LS.Send.lng + '&' +
     'M' + '=' +  LS.Send.Message;
  console.log(note);
  el.href = note;
  map.closePopup();
  $('#modalNotas').fadeToggle();
  $('.btnMain').fadeOut();

} 
          


function placeMarker( selectedMap ){
//  var test = LS.Send.Marker._latlng
//  if ( isFinite(test.lat) && isFinite(test.lng) ){
    if (!LS.Send.Marker._latlng ) {
      console.log('if (!LS.Send.Marker._latlng ) { passed!  line 95');
      LS.Send.Marker = L.marker( selectedMap.getCenter() , {draggable: true, icon: sendIcon} );
      setSendValues( selectedMap.getCenter() );
      LS.Send.Marker.on('dragend', function(event) {
        setSendValues( event.target.getLatLng());
        LS.Send.Marker.openPopup();
      });
      LS.Send.Marker.bindPopup(LS.Send.Popup);
      LS.Send.Marker.addTo(selectedMap);
    } else {
      LS.Send.Marker.setLatLng( selectedMap.getCenter() )
    }
    
    LS.Send.Marker.openPopup();
};

LS.Send.UpdateMessage = function( text ){
  var encodedForUrl = encodeURIComponent( text.value );
  LS.Send.Message = encodedForUrl;
}

function setSendValues( result ){
  LS.Send.lat = result.lat;
  LS.Send.lng = result.lng; 
}









