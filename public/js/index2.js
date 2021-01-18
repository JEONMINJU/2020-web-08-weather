// openweathermap : a3cc7d1ddfb0e5a69dee51212124fe81
// kakao : 9c66b02c65cf987e9dfcb9a66bcaa825

/*  전역 설정 */
var map;
var cities; // 전역변수를 설정해줘서 어디에서든 접근.
var cityCnt = 0; // onCreateMarker (도시정보 14번 요청,실행) 에서 갯수를 센다.
var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'; //현재 날씨를 가져다 주고 
var onecallUrl = 'https://api.openweathermap.org/data/2.5/onecall'; // 7일간의 날씨 데이터
var params = {
	appid: '02efdd64bdc14b279bc91d9247db4722', // 고정값
	units: 'metric',
	lang: 'kr'
}

/************** 이벤트 등록 **************/
navigator.geolocation.getCurrentPosition(onGetPosition, onGetPositionError); //현재 위치 가져와
mapInit(); //지도를 만들어라.


/*********이벤트 콜백  (함수를 만들어서 실행시키는 곳? ) **********/
function onResize() {
	map.setCenter(new kakao.maps.LatLng(35.8, 127.7));
}

function onGetPosition(r) {
	getWeather(r.coords.latitude, r.coords.longitude);
} // lat , lon 인자로 보내기

function onGetPositionError(e) {
	getWeather(37.566679, 126.978413);
} // lat , lon 인자로 보내기

function onGetWeather(r) {
	console.log(r);
  updateDaily(r);
	updateBg(r.weather[0].icon); //updateBg라는 함수를 실행할 건데, 거기에 (r.weather[0].icon)을 보내준다.
}


function onGetCity(r) { // 제이슨 시티 정보를 가져오고 나면,
  //creatMarker(r.cities);
    cities = r.cities;
    for(var i in cities)  { //보낼 정보의 렛과 론을 바꿔서
      params.lat = '';
      params.lon = '';
      params.id = cities[i].id;
      $.get(weatherUrl, params, onCreateMarker); //여기로 보낸다.
     }
  }
  // 여기서 openweathermap 과 통신을 해서 날씨 정보를 받아와야한다. 통신으로 날씨정보를 받아오는게 완료되면 그때 그 정보로 marker를 만든다.

function onCreateMarker(r) {
 /*  for(var i in cities) {
      if(cities[i].id === r.id ){
        r.cityName = cities[i].name;
        break; //cities[i].id 값이 r.id 값과 일치하니? 일치하면 빠져나와.
      }
  } */
  cityCnt++; // 실행될 때마다 하나씩을 더해준다.
	var city = cities.filter(function(v){ 
		return v.id === r.id;
  });//배열cities를 순회하면서 괄호 안 조건을 필터링해준다.
    var content = '';
      content += '<div class="popper '+city[0].class+' " onclick="getWeather('+city[0].id+')">';
      content += '<div class="img-wrap">';
      content += '<img src="http://openweathermap.org/img/wn/'+r.weather[0].icon+'.png" class="mw-100">';
      content += '</div>';
      content += '<div class="cont-wrap">';
      content += '<div class="name">'+city[0].name+'</div>';
      content += '</div>';
      content += '<i class="fa fa-caret-down"></i>';
      content += '</div>'; 
      var position = new kakao.maps.LatLng(r.coord.lat, r.coord.lon); 
      var customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content
      });
    customOverlay.setMap(map);
    content = '<div class="city swiper-slide" onclick="getWeather('+city[0].id+')">'; //각각의 시티가 스와이퍼 슬라이드
    content += '<div class="name">'+city[0].name+'</div>';
    content += '<div class="content">';
    content += '<div class="img-wrap">';
    content += '<img src="http://openweathermap.org/img/wn/'+r.weather[0].icon+'.png" class="mw-100">';
     content += '</div>';
     content += '<div class="cont-wrap">';
     content += '<div class="temp">온도&nbsp;&nbsp;'+r.main.temp+'도</div>';
     content += '<div class="name">체감&nbsp;&nbsp;'+r.main.feels_like+'도</div>';
     content += '</div></div></div>';
     $('.city-wrap .swiper-wrapper').append(content);
     //onCreateMarker 돌면서 append 시키고
     if(cityCnt  == cities.length) {
       var swiper = new Swiper('.city-wrap > .swiper-container', {
         slidesPerView: 2,
         spaceBetween: 10,
         loop: true,
         navigation: {
          nextEl: '.city-wrap > .bt-next',
          prevEl: '.city-wrap > .bt-prev',
        },
         breakpoints: {
           576: { slidesPerView: 3 }, //마진이 자동으로 들어감.
           768: { slidesPerView: 4 },
         }
       } );// 먼저 들어온 시티 정보부터 
     }
    }

 /************사용자 함수 ***********/
 function updateDaily(r) {
	var $city = $(".daily-container .city");
	var $imgWrap = $(".daily-container .img-wrap");
	var $tempWrap = $(".daily-container .temp-wrap");
	var $infoWrap = $(".daily-container .info-wrap");
	var src = 'http://openweathermap.org/img/wn/'+r.weather[0].icon+'@2x.png';
	$city.html(r.name + ', ' + r.sys.country);
	$imgWrap.find("img").attr('src', src); // $("img", $imgWrap).attr('src', src);
	$tempWrap.find("h3").html(r.main.temp+'˚');
	$tempWrap.find("div").html('(체감 '+r.main.feels_like+'˚)');
	$infoWrap.find("h3").html(r.weather[0].main+' <small>('+r.weather[0].description+')</small>');
	$infoWrap.find(".temp .info").eq(0).html(r.main.temp_max+'˚');
	$infoWrap.find(".temp .info").eq(1).html(r.main.temp_min+'˚');
	$infoWrap.find(".wind .arrow").css('transform', 'rotate('+r.wind.deg+'deg)');
	$infoWrap.find(".wind .info").html(r.wind.speed+'㎧');
	$infoWrap.find(".date .title").html(moment(r.dt*1000).format('YYYY년 M월 D일 H시 m분')+' 기준');
}

function getWeather(param, param2) {
	if(param && param2) {
		params.id = '';
		params.lat = param; // lat 받고
		params.lon = param2; // lon 받고
	}
	else {
		params.id = param; // id  도 받고 
		params.lat = '';
		params.lon = '';
	}
	$.get(weatherUrl, params, onGetWeather);
	$.get(onecallUrl, params, onGetWeekly);
}

function mapInit() {
  var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(35.8, 127.7), // 지도의 중심좌표
        level: 13, // 지도의 확대 레벨
        draggable: false, //지도의 이동을 막음 (트루를 주면 이동가능)
        zoomable: false, 
        disableDoubleClick: true // 더블클릭시 확대
    };
// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
  map = new kakao.maps.Map(mapContainer, mapOption); 

  $(window).resize(onResize); // mapInit 으로 지도가 다 만들어 진 후 리사이즈 이벤트가 일어나게 !! 리사이즈 될 때마다 셋센터 이벤트가 먹는다.
  $.get('../json/city2.json', onGetCity);
}

//updateBg 가 실행되면서 (icon) 을 받아온다.
function updateBg(icon) { 
	var bg; //변수 bg를 만들어놓고,
	switch(icon) {
		case '01d':
			bg = '01d-bg.jpg';
			break;
		case '01n':
			bg = '01n-bg.jpg';
			break;
		case '02d':
		case '03d':
		case '04d':
			bg = '03d-bg.jpg';
			break;
		case '02n':
		case '03n':
		case '04n':
			bg = '03n-bg.jpg';
			break;
		case '09d':
		case '10d':
			bg = '09d-bg.jpg';
			break;
		case '09n':
		case '10n':
			bg = '09n-bg.jpg';
			break;
		case '11d':
			bg = '11d-bg.jpg';
			break;
		case '11n':
			bg = '11n-bg.jpg';
			break;
		case '13d':
			bg = '13d-bg.jpg';
			break;
		case '13n':
			bg = '13n-bg.jpg';
			break;
		case '50d':
			bg = '50d-bg.jpg';
			break;
		case '50n':
			bg = '50n-bg.jpg';
			break;
	}
	$(".all-wrapper").css('background-image', 'url(../img/'+bg+')');
}