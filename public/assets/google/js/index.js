var markers = [];

function initMap() {
  const myLatlng = iniData;
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: myLatlng,
  });

  placeMarker(myLatlng, map);
  var initialPlace = JSON.stringify(myLatlng);
  sendData(initialPlace);

  map.addListener("click", (mapsMouseEvent) => {
    deleteMarkers();
    var clickData = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
    console.log(clickData);
    sendData(clickData);

    placeMarker(mapsMouseEvent.latLng, map);
  });

  function placeMarker(position, map) {
    var marker = new google.maps.Marker({
      position: position,
      map: map,
    });
    markers.push(marker);
    map.panTo(position);
  }
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function sendData(data) {
  fetch("/google/clickdata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

window.initMap = initMap;
