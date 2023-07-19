const url = "https://gofans.cn/limited/ios";
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
};
const LOG_URL = "http://localhost:3000"; // 替换为你本地日志服务器的地址

if (typeof $task !== 'undefined') {
  $task.fetch({ url: url, headers: headers }).then(response => {
    handleResponse(response.body);
  }, reason => {
    sendLog('获取应用信息失败: ' + reason.error);
    $done();
  });
} else if (typeof $httpClient !== 'undefined' && typeof $notification !== 'undefined') {
  $httpClient.get({ url: url, headers: headers }, function (error, response, body) {
    if (error) {
      sendLog('获取应用信息失败: ' + error);
      $done();
      return;
    }
    handleResponse(body);
  });
} else if (typeof $request !== 'undefined' && typeof $notify !== 'undefined') {
  $httpClient.get({ url: url, headers: headers }, function (error, response, body) {
    if (error) {
      sendLog('获取应用信息失败: ' + error);
      $done();
      return;
    }
    handleResponse(body, $request.headers);
  });
} else {
  sendLog('未知的脚本运行环境');
  $done();
}

function handleResponse(body, requestHeaders) {
  const appList = parseAppList(body);
  const freeAppList = appList.filter(app => app.price === "Free");

  let notificationContent = '';
  const appCount = requestHeaders ? parseInt(requestHeaders['appCount']) || 8 : 8;
  for (let i = 0; i < freeAppList.length && i < appCount; i++) {
    const app = freeAppList[i];
    const description = truncateDescription(app.description, 30);
    notificationContent += `🆓${app.name}｜原价￥${app.originalPrice}\nApp Store 链接：${app.appStoreLink}\n`;
  }

  if (typeof $notify !== 'undefined') {
    $notify("AppStore限免APP", '', notificationContent);
  } else if (typeof $notification !== 'undefined') {
    $notification.post("AppStore限免APP", '', notificationContent);
  } else {
    sendLog('未知的通知函数');
  }

  sendLog(notificationContent); // 发送日志内容

  $done();
}

function parseAppList(html) {
  const regex = /<div[^>]+class="column[^"]*"[^>]*>[\s\S]*?<strong[^>]+class="title[^"]*"[^>]*>(.*?)<\/strong>[\s\S]*?<b[^>]*>(.*?)<\/b>[\s\S]*?<div[^>]+class="price-original[^"]*"[^>]*>[^<]*<del[^>]*>(.*?)<\/del>[\s\S]*?<p[^>]+class="intro[^"]*"[^>]*>([\s\S]*?)<\/p>[\s\S]*?<a[^>]+class="download"[^>]+href="(.*?)"[^>]*>/g;
  const appList = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const name = match[1];
    const price = match[2];
    const originalPrice = parseFloat(match[3]).toFixed(1);
    const description = match[4].replace(/<.*?>/g, '').replace(/\n+/g, ' ').trim();
    const appStoreLink = match[5];
    appList.push({
      name: name,
      price: price,
      originalPrice: originalPrice,
      description: description,
      appStoreLink: appStoreLink
    });
  }
  return appList;
}

function truncateDescription(description, maxLength) {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + '…';
  }
  return description;
}

function sendLog(message) {
  const log = { message: message };
  $httpClient.post({
    url: LOG_URL,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log)
  }, function(error, response, body) {
    if (error) {
      console.log('发送日志失败:', error);
    } else {
      console.log('日志已发送:', message);
    }
  });
}
