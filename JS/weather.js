const apiUrl = "http://t.weather.sojson.com/api/weather/city/101210411";

const cityId = getCityId($request.url);
if (cityId) {
  const apiUrlWithCityId = `${apiUrl}${cityId}`;
  $httpClient.get(apiUrlWithCityId, function (error, response, data) {
    if (error) {
      console.log(error);
      $done();
      return;
    }

    const weatherData = JSON.parse(data);
    if (weatherData.status !== 200) {
      console.log(`请求失败，状态码：${weatherData.status}`);
      $done();
      return;
    }

    const cityInfo = weatherData.cityInfo;
    const currentWeather = weatherData.data.forecast[0];
    const message = `📍城市：${cityInfo.city}\n🕰︎更新时间：${cityInfo.updateTime} \n🌤︎天气：${currentWeather.type}\n🌡︎温度：${currentWeather.low}  ${currentWeather.high}\n💧湿度：${weatherData.data.shidu}\n💨空气质量：${weatherData.data.quality}\n☁️PM2.5：${weatherData.data.pm25}\n☁️PM10：${weatherData.data.pm10}\n🪁风向：${currentWeather.fx}\n🌪️风力：${currentWeather.fl}\n🌅日出时间：${currentWeather.sunrise}\n🌇日落时间：${currentWeather.sunset}\n🏷︎Tips：${currentWeather.notice}`;

    // 将天气信息发送到 Surge 通知中心
    $notification.post("今日天气", "", message);
    
    $done();
  });
} else {
  console.log("城市 ID 未找到");
  $done();
}

function getCityId(url) {
  const regex = /cityId=(\d+)/;
  const match = url.match(regex);
  if (match && match.length >= 2) {
    return match[1];
  } else {
    return null;
  }
}

