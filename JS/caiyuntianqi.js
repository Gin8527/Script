// 设置彩云天气API和腾讯地图API的Token
const caiyunToken = 'fmqppLgQRcTNFjpB';
const tencentToken = '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';
const cityCode = '101210411'; // 替换成你想要查询的城市代码
// 获取实时天气数据
async function getWeatherData() {
  const url = `https://api.caiyunapp.com/v2.5/${caiyunToken}/${cityCode}/weather?lang=zh_CN&dailystart=0&hourlysteps=384&dailysteps=16&alert=true`;
  const response = await $httpClient.get(url);
  const weatherData = JSON.parse(response.body);
  return weatherData.result.realtime;
}

// 生成面板代码
function generatePanel(weatherData) {
  const weatherDescription = weatherData.skycon;
  const temperature = weatherData.temperature;
  const humidity = (weatherData.humidity * 100).toFixed(0);
  const windInfo = weatherData.wind;
  
  const panelCode = `
[🏙 天气预报]
${weatherDescription} ${temperature}°C  湿度${humidity}%
风向：${windInfo.direction}  风速：${windInfo.speed} km/h
`;
  
  return panelCode;
}

// 运行主函数
(async () => {
  try {
    const weatherData = await getWeatherData();
    const panelCode = generatePanel(weatherData);
    console.log(panelCode);
    $done({ body: panelCode });
  } catch (error) {
    console.log("Error:", error.message);
    $done();
  }
})();
