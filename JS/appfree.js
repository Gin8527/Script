const CAIYUN_API_KEY = 'fmqppLgQRcTNFjpB'; // 替换为你的彩云天气 API 密钥
const TENCENT_MAP_API_KEY = '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'; // 替换为你的腾讯地图 API 密钥
const CITY_CODE = '330200'; // 替换为你的城市代码

// 浙江省城市代码
// 杭州市：330100
// 宁波市：330200
// 温州市：330300
// 嘉兴市：330400
// 湖州市：330500
// 绍兴市：330600
// 金华市：330700
// 衢州市：330800
// 舟山市：330900
// 台州市：331000
// 丽水市：331100

const CAIYUN_API_URL = `https://api.caiyunapp.com/v2.5/${CAIYUN_API_KEY}/${TENCENT_MAP_API_KEY}/${CITY_CODE}/weather.json`;
const TENCENT_MAP_API_URL = `https://apis.map.qq.com/ws/geocoder/v1/?key=${TENCENT_MAP_API_KEY}&location=${CITY_CODE}`;

$httpClient.get(CAIYUN_API_URL, (error, response, body) => {
  if (error) {
    console.log('获取天气信息失败:', error);
    $done();
    return;
  }

  const weatherData = JSON.parse(body);
  const currentWeather = weatherData.result.realtime;
  const temperature = currentWeather.temperature;
  const precipitation = currentWeather.precipitation;

  $httpClient.get(TENCENT_MAP_API_URL, (error, response, body) => {
    if (error) {
      console.log('获取地理位置信息失败:', error);
      $done();
      return;
    }

    const locationData = JSON.parse(body);
    const location = locationData.result.address;

    const hourlyWeather = weatherData.result.hourly;
    const hourlyWeatherSummary = hourlyWeather.description;
    const hourlyWeatherForecast = hourlyWeather.skycon.slice(0, 5);

    let weatherForecast = `当前位置: ${location}\n当前温度: ${temperature}℃\n降雨概率: ${precipitation}%\n未来5小时天气预报:`;

    hourlyWeatherForecast.forEach((forecast, index) => {
      const hour = (index + 1) * 1;
      weatherForecast += `\n${hour}小时后: ${forecast.value}`;
    });

    console.log(weatherForecast);
    $done();
  });
});
