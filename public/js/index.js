/// function a(arg, arg2) {}
// arguments, parameters, 인자, 매개변수 ...

// $.get(url, cb);
// $.get(url, params(쿼리를 객체형태로 전송), cb);


// 웹사이트 주소체계: https://nodejs.org/dist/latest-v15.x/docs/api/url.html
/*
// AJAX 통신
var url = 'https://api.openweathermap.org/data/2.5/onecall?lat=38&lon=127&appid=a3cc7d1ddfb0e5a69dee51212124fe81&units=metric&exclude=minutely,hourly';
function onGet(r) {
	console.log(r);
}

$("#bt").click(function(){
	$.get(url, onGet);
});
*/

// openweathermap : a3cc7d1ddfb0e5a69dee51212124fe81
// kakao : 9c66b02c65cf987e9dfcb9a66bcaa825

// 7days: https://api.openweathermap.org/data/2.5/onecall?lat=38&lon=127&appid=a3cc7d1ddfb0e5a69dee51212124fe81&units=metric&exclude=minutely,hourly  <-- get 방식

/*************************전역설정********************/
var map;
var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';//요청하는 곳의 주소
var params = {
	appid: 'a3cc7d1ddfb0e5a69dee51212124fe81',// 고정값
	units: 'metric',
	exclude: 'minutely,hourly'
}

/*************************이벤트등록********************/
navigator.geolocation.getCurrentPosition(onGetPosition, onGetPositionError); //네비게이터 객체가 가지고 있는 지오로케이션함수의 getCurrentPosition();를 실행 한것, 괄호 열고 닫으면 실행한것.
//두개의 콜백을 넣어줌. ->(onGetPosition, onGetPositionError);

mapInit();

/****************** 이벤트콜백 *******************/
function onGetPosition(r) {
	getWeather(r.coords.latitude, r.coords.longitude);
}

function onGetPositionError(e) {
	getWeather(37.566679, 126.978413);
}

function onGetWeather(r) {
	console.log(r);
	console.log(r.weather[0].icon);
	updateBg(r.weather[0].icon);
}

function onGetCity(r) {
	createMarker(r.cities);
	// 변경할 사항은 위의 createMarker를 실행하지 않고, openweathermap 통신으로 날씨정보를 받아오는게 완료되면 그때 그 정보로 marker를 만든다.
}

/****************** 사용자함수 *******************/
function createMarker(v) {
	for(var i in v) {
		var content = '';
		content += '<div class="popper '+v[i].class+'">';
		content += '<div class="img-wrap">';
		content += '<img src="http://openweathermap.org/img/wn/02d.png" class="mw-100">';
		content += '</div>';
		content += '<div class="cont-wrap">';
		content += '<div class="name">'+v[i].name+'</div>';
		content += '<div class="temp">-3.57도</div>';
		content += '</div>';
		content += '<i class="fa fa-caret-down"></i>';
		content += '</div>';
		var position = new kakao.maps.LatLng(v[i].lat, v[i].lon); 
		var customOverlay = new kakao.maps.CustomOverlay({
			position: position,
			content: content
		});
		customOverlay.setMap(map);
	}
}


function getWeather(lat, lon) {
	params.lat = lat;
	params.lon = lon;
	$.get(weatherUrl, params, onGetWeather);
}

function mapInit() {
	var mapOption = { 
		center: new kakao.maps.LatLng(35.8, 127.7),  // 지도의 중심좌표
		level: 13 // 지도의 확대 레벨
	};
	map = new kakao.maps.Map($('#map')[0], mapOption); // 지도 표시, 지도 옵션
	map.setDraggable(false);
	map.setZoomable(false);
	
	$.get('../json/city.json', onGetCity);
}

function updateBg(icon) {
	var bg;
	switch(icon) {
		case '01d':
		case '02d':
			bg = '01d-bg.jpg';
			break;
		case '01n':
		case '02n':
			bg = '01n-bg.jpg';
			break;
		case '03d':
		case '04d':
			bg = '03d-bg.jpg';
			break;
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







