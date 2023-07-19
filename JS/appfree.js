const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();

if (hour === 9 && minute === 0) {
  $notification.post('上班提醒', '', '现在是上班时间，请准备工作！');
} else if (hour === 18 && minute === 0) {
  $notification.post('下班提醒', '', '现在是下班时间，辛苦一天，可以放松一下了！');
} else if (hour < 18) {
  const remainingHours = 18 - hour;
  const remainingMinutes = (remainingHours - 1) * 60 + (60 - minute);
  $notification.post('下班倒计时', '', `距离下班还有 ${remainingHours} 小时 ${remainingMinutes} 分钟`);
} else {
  const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const remainingHours = 24 - (hour - 18);
  const remainingMinutes = (remainingHours - 1) * 60 + (60 - minute);
  $notification.post('下班倒计时', '', `距离下班还有 ${remainingHours} 小时 ${remainingMinutes} 分钟`);
}
