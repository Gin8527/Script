const CAIYUN_API_KEY = 'fmqppLgQRcTNFjpB'; // 替换为你的彩云天气 API 密钥
const TENCENT_MAP_API_KEY = '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'; // 替换为你的腾讯地图 API 密钥
const CITY_CODE = '330200'; // 替换为你的城市代码

const CAIYUN_API_URL = `https://api.caiyunapp.com/v2.5/${CAIYUN_API_KEY}/${TENCENT_MAP_API_KEY}/${CITY_CODE}/weather.json`;
const TENCENT_MAP_API_URL = `https://apis.map.qq.com/ws/geocoder/v1/?key=${TENCENT_MAP_API_KEY}&location=${CITY_CODE}`;

$httpClient.get(CAIYUN_API_URL, (error, response, body) => {
  if (error) {
    $notification.post('获取天气信息失败', error, '');
    $done();
    return;
  }

  const weatherData = JSON.parse(body);
  const currentWeather = weatherData.result.realtime;
  const temperature = currentWeather.temperature;
  const precipitation = currentWeather.precipitation;

  $httpClient.get(TENCENT_MAP_API_URL, (error, response, body) => {
    if (error) {
      $notification.post('获取地理位置信息失败', error, '');
      $done();
      return;
    }

    const locationData = JSON.parse(body);
    const location = locationData.result.address;

    const hourlyWeather = weatherData.result.hourly;
    const hourlyWeatherForecast = hourlyWeather.skycon.slice(0, 5);

    let weatherForecast = `当前位置: ${location}\n当前温度: ${temperature}℃\n降雨概率: ${precipitation}%\n未来5小时天气预报:`;

    hourlyWeatherForecast.forEach((forecast, index) => {
      const hour = (index + 1) * 1;
      weatherForecast += `\n${hour}小时后: ${forecast.value}`;
    });

    $notification.post('实时天气情况', '', weatherForecast);
    $done();
  });
});

    $notification.post('实时天气情况', '', weatherForecast);
    $done();
  });
});
