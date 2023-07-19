const url = "https://www.toutiao.com/api/pc/hot_gallery/?widen=1";

$httpClient.get(url, function(error, response, data) {
  if (error) {
    console.log(error);
    $done();
  } else {
    const result = JSON.parse(data);
    if (result && result.data && result.data.length > 0) {
      const hotNews = result.data.map(item => item.title);
      $notification.post("今日头条热榜", "", hotNews.join("\n"));
      $done();
    } else {
      console.log("无法获取热榜数据");
      $done();
    }
  }
});
