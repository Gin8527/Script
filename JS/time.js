// surge模块: 日期时间通知
// 作者: Bing
// 说明: 这个模块可以在通知中心显示当前的日期和时间，每隔一分钟更新一次。
// 用法: 在Surge的配置文件中添加这个模块，然后在通知中心添加一个Surge小组件，选择这个模块。

const $ = new API("date-time-notify");

// 获取当前的日期和时间
function getDateTime() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  // 补零
  function padZero(num) {
    return num < 10 ? "0" + num : num;
  }
  // 格式化
  let dateTime = `${year}-${padZero(month)}-${padZero(date)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
  return dateTime;
}

// 显示通知
function showNotify() {
  let title = "日期时间通知";
  let message = getDateTime();
  $.notify(title, "", message);
}

// 定时任务
$.timer.register(60, true, showNotify);

$.done();
