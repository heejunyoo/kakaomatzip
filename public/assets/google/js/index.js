// 마커 관리를 위한 array
var markers = [];

// 구글맵 생성
function initMap() {
  // ejs 에 명시된 값 가져오기
  const myLatlng = LatlngData;

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: myLatlng,
  });

  // lat, lng 값을 기반으로 마커 만들기
  placeMarker(myLatlng, map);
  // console.log(myLatlng);

  // map SDK 의 click 이벤트
  map.addListener("click", (mapsMouseEvent) => {
    //현재 존재하는 마커 우선 삭제
    deleteMarkers();

    // map 클릭 이벤트에서 응답되는 lat, lng 값
    var clickData = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
    var clickDataObject = JSON.parse(clickData);

    // console.log(clickDataObject);
    // console.log(clickDataObject.lat);

    redirectToNewPage(clickDataObject);

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

// 현재 마커를 지우기 위한 사전 작업
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// 마커를 지도에서 숨기기
function clearMarkers() {
  setMapOnAll(null);
}

// 마커를 삭제하기
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

// 서버로 데이터 전달하는 함수
function sendData(data) {
  fetch("/google/clickdata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

function redirectToNewPage(data) {
  window.location.href = `/google/result?lat=${data.lat}&lng=${data.lng}`;
}

window.initMap = initMap;
