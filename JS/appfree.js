const workStartTime = 9; // 上班时间，单位：小时
const workEndTime = 18; // 下班时间，单位：小时

const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();
const second = now.getSeconds();

if (hour >= workStartTime && hour < workEndTime) {
  const remainingSeconds = (workEndTime - hour - 1) * 3600 + (60 - minute - 1) * 60 + (60 - second);
  $notification.post('下班倒计时', '', `距离下班还有 ${remainingSeconds} 秒`);
} else if (hour === workStartTime && minute === 0 && second === 0) {
  $notification.post('上班提醒', '', '现在是上班时间，请准备工作！');
} else if (hour === workEndTime && minute === 0 && second === 0) {
  $notification.post('下班提醒', '', '现在是下班时间，辛苦一天，可以放松一下了！');
} else {
  $notification.post('工作时间提醒', '', '现在不是上班时间，请好好休息！');
}

$done();
