const url = "https://www.toutiao.com/api/pc/hot_gallery/?widen=1";

$httpClient.get(url, function(error, response, data) {
  if (error) {
    console.log(error);
    $done();
  } else {
    const result = JSON.parse(data);
    if (result && result.data && result.data.length > 0) {
      const hotNews = result.data.map((item, index) => {
        const title = item.title;
        console.log(`[${index + 1}] ${title}`);
        return `[${index + 1}] ${title}`;
      });
      const notificationBody = hotNews.join("\n");
      $notification.post("今日头条热榜", "", notificationBody);
      $done();
    } else {
      console.log("无法获取热榜数据");
      $done();
    }
  }
});


