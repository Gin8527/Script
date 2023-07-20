# 定义9点上班、18点下班、工作时间提醒
# By Gin8527，2023/07/20

const workStartTime = 9; // 上班时间，单位：小时
const workEndTime = 18; // 下班时间，单位：小时

const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();
const second = now.getSeconds();

if (hour >= workStartTime && hour < workEndTime) {
  const remainingHours = workEndTime - hour - 1;
  const remainingMinutes = 60 - minute - 1;
  const remainingSeconds = 60 - second;
  const currentTime = formatDate(now, "hh:mm:ss");

  const message = 现在是北京时间 ${currentTime}\n距离下班还有 ${remainingHours} 小时 ${remainingMinutes} 分钟 ${remainingSeconds} 秒 😊;
  $notification.post('下班倒计时', '', message);
} else if (hour === workStartTime && minute === 0 && second === 0) {
  const currentTime = now.format("hh:mm:ss");
  $notification.post('上班提醒', '', `现在是北京时间 ${currentTime}\n请开始准备工作啦 😊`);
} else if (hour === workEndTime && minute === 0 && second === 0) {
  const currentTime = now.format("hh:mm:ss");
  $notification.post('下班提醒', '', `现在是北京时间 ${currentTime}\n辛苦一天，可以放松一下了 😊`);
} else {
  const currentTime = now.format("hh:mm:ss");
  $notification.post('工作时间提醒', '', `现在是北京时间 ${currentTime}\n放心玩耍吧 😊`);
}

$done();

// 自定义日期格式化函数
function formatDate(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
