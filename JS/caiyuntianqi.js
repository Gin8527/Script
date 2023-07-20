// 引入API模块
const API = require('path/to/api.js');

// 设置彩云天气API和腾讯地图API的Token
const caiyunToken = 'fmqppLgQRcTNFjpB';
const tencentToken = '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';

// 创建一个API实例
const $ = new API("Weather");
const ERR = new API.ERR();

// 获取城市代码
const cityCode = '101210411'; // 替换成你想要查询的城市代码

// 主函数
async function main() {
  try {
    // 查询天气数据
    const weatherData = await getWeatherData();

    // 生成面板代码
    const panelCode = generatePanel(weatherData);

    // 输出面板代码
    console.log(panelCode);

    // 更新面板
    $.done({ body: panelCode });
  } catch (error) {
    console.log("Error:", error.message);
    $.done();
  }
}

// 获取天气数据
async function getWeatherData() {
  // 构建查询天气的URL
  const url = `https://api.caiyunapp.com/v2.5/${caiyunToken}/${cityCode}/weather?lang=zh_CN&dailystart=0&hourlysteps=384&dailysteps=16&alert=true`;

  // 发起查询请求
  const response = await $.http.get(url);

  // 处理返回的JSON数据
  const weatherData = JSON.parse(response.body);

  return weatherData;
}

// 生成面板代码
function generatePanel(weatherData) {
  // 获取实时天气数据
  const currentWeather = weatherData.result.realtime;

  // 获取天气状况描述
  const weatherDescription = currentWeather.skycon;

  // 获取温度和湿度
  const temperature = currentWeather.temperature;
  const humidity = currentWeather.humidity;

  // 获取风力风向信息
  const windInfo = currentWeather.wind;

  // 生成面板代码
  const panelCode = `
[🏙 天气预报]
${weatherDescription} ${temperature}°C  湿度${humidity}%
风向：${windInfo.direction}  风速：${windInfo.speed} km/h
`;

  return panelCode;
}

// 运行主函数
main();
