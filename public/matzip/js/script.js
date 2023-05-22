var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
var options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(37.559907900646, 126.98302069842), //지도의 중심좌표.
  level: 7, //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 마커를 표시할 위치와 title 객체 배열입니다
// var positions = [
//   {
//       title: '카카오',
//       latlng: new kakao.maps.LatLng(33.450705, 126.570677)
//   },
//   {
//       title: '생태연못',
//       latlng: new kakao.maps.LatLng(33.450936, 126.569477)
//   },
//   {
//       title: '텃밭',
//       latlng: new kakao.maps.LatLng(33.450879, 126.569940)
//   },
//   {
//       title: '근린공원',
//       latlng: new kakao.maps.LatLng(33.451393, 126.570738)
//   }
// ];

const dataSet = [
  {
    title: "대성집",
    address: "서울 종로구 행촌동 209-35",
    url: "https://www.youtube.com/watch?v=wu1fOmsPEr8&list=PLuMuHAJh9g_Py_PSm8gmHdlcil6CQ9QCM&index=90",
    category: "구이",
  },
  {
    title: "어머니 대성집",
    address: "서울 동대문구 왕산로11길 4",
    url: "https://www.youtube.com/watch?v=28pXe1a9yrA&list=PLuMuHAJh9g_Py_PSm8gmHdlcil6CQ9QCM&index=88",
    category: "국밥",
  },
  {
    title: "약수순대",
    address: "서울 중구 다산로8길 7",
    url: "https://www.youtube.com/watch?v=p52CSWUXQMk&list=PLuMuHAJh9g_Py_PSm8gmHdlcil6CQ9QCM&index=87",
    category: "국밥",
  },
  {
    title: "화목 순대국",
    address: "서울 영등포구 여의대방로 383 경도상가 1층",
    url: "https://www.youtube.com/watch?v=DpGJEDKsf1o&list=PLuMuHAJh9g_Py_PSm8gmHdlcil6CQ9QCM&index=86",
    category: "국밥",
  },
  {
    title: "신미식당",
    address: "서울 강남구 압구정로 214 현대종합상가빌딩 1층",
    url: "https://www.youtube.com/watch?v=a4IFiQUf3D4&list=PLuMuHAJh9g_Py_PSm8gmHdlcil6CQ9QCM&index=85",
    category: "국밥",
  },
];

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

function getCoordsByAddress(address) {
  return new Promise((resolve, reject) => {
    geocoder.addressSearch(address, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        resolve(coords);
        return;
      }
      reject(new Error("getCoordsByAddress Error: not Valid Address"));
    });
  });
}

setMap(dataSet);

// 마커 이미지의 이미지 주소입니다
var imageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

function getContent(data) {
  let videoId = "";
  let replaceUrl = data.url;
  replaceUrl = replaceUrl.replace("https://youtu.be/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/watch?v=", "");
  videoId = replaceUrl.split("&")[0];
  // 인포윈도우 가공하기
  const result = `
  <div class="infowindow">
    <div class="infowindow-img-container">
      <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" class="infowindow-img">
    </div>
    <div class="infowindow-body">
      <h5 class="infowindow-title">${data.title}</h5>
      <p class="infowindow-address">${data.address}</p>
      <a href="${data.url}" class="infowindow-btn" target="_blank"></a>
    </div>
  </div>
  `;
  return result;
}

async function setMap(dataSet) {
  for (var i = 0; i < dataSet.length; i++) {
    // 마커를 생성합니다
    let coords = await getCoordsByAddress(dataSet[i].address);
    var marker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: coords, // 마커를 표시할 위치
    });

    markerArray.push(marker);

    // 마커에 표시할 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
      content: getContent(dataSet[i]), // 인포윈도우에 표시할 내용
      disableAutoPan: true,
    });

    infowindowArray.push(infowindow);

    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
    kakao.maps.event.addListener(
      marker,
      "click",
      makeOverListener(map, marker, infowindow)
    );
    kakao.maps.event.addListener(map, "click", makeOutListener(infowindow));
  }
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
function makeOverListener(map, marker, infowindow, coords) {
  return function () {
    closeInfoWindow();
    infowindow.open(map, marker);
    map.panTo(coords);
  };
}

let infowindowArray = [];
function closeInfoWindow() {
  for (infowindow of infowindowArray) {
    infowindow.close();
  }
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
  return function () {
    infowindow.close();
  };
}

// 카테고리
const categoryMap = {
  kokbab: "국밥",
  china: "중식",
  japan: "일식",
  america: "양식",
  wheat: "분식",
  meat: "구이",
  sushi: "회/초밥",
  etc: "기타",
};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);

function categoryHandler(event) {
  const categoryId = event.target.id;
  console.log(categoryId);
  const category = categoryMap[categoryId];
  console.log(category);

  // 데이터 분류
  let categorizedDataSet = [];
  for (let data of dataSet) {
    if (data.category === category) {
      categorizedDataSet.push(data);
    }
  }
  console.log(categorizedDataSet);

  // 기존 마커 삭제
  closeMarker();

  // 기존 인포윈도우 닫기
  closeInfoWindow();

  setMap(categorizedDataSet);
}

let markerArray = [];
function closeMarker() {
  for (marker of markerArray) {
    marker.setMap(null);
  }
}