const cityId = $prefs.valueForKey("cityId") || "101210411";
const apiUrl = `http://t.weather.sojson.com/api/weather/city/${cityId}`;

$task.fetch({ url: apiUrl }).then((response) => {
  const data = JSON.parse(response.body);
  if (data.status !== 200) {
    console.log(`请求失败，状态码：${data.status}`);
    $done();
    return;
  }

  const cityInfo = data.cityInfo;
  const currentWeather = data.data.forecast[0];
  const message = `📍城市：${cityInfo.city}\n🕰︎更新时间：${cityInfo.updateTime}\n🌤︎天气：${currentWeather.type}\n🌡︎温度：${currentWeather.low} ${currentWeather.high}\n💧湿度：${data.data.shidu}\n💨空气质量：${data.data.quality}\n☁️PM2.5：${data.data.pm25}\n☁️PM10：${data.data.pm10}\n🪁风向：${currentWeather.fx}\n🌪️风力：${currentWeather.fl}\n🌅日出时间：${currentWeather.sunrise}\n🌇日落时间：${currentWeather.sunset}\n🏷︎Tips：${currentWeather.notice}`;

  const body = {
    title: "今日天气",
    content: message,
    "icon-color": $prefs.valueForKey("color"),
  };
  $done(body);
}, (error) => {
  console.log("请求失败：" + error);
  $done();
});
