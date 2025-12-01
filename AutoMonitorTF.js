/**
 TestFlight 空位监控（Loon）
 - 参数从插件 Argument 传入：
   - $argument.tf_app_ids: App ID 列表（逗号或换行分隔；支持“ID#备注名”）
 - 定时任务：由插件中的 cron 配置驱动
*/

const ICON_URL = "https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/TestFlight_01.png";

const userAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7_9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_5_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
];

function getArgs() {
  try {
    if (typeof $argument === "object" && $argument) return $argument;
    if (typeof $argument === "string" && $argument.trim()) {
      try { return JSON.parse($argument); } catch { return { tf_app_ids: $argument }; }
    }
  } catch {}
  return {};
}

function splitIds(input) {
  return (input || "")
    .split(/\s*[\n,]\s*/).map(s => s.trim()).filter(Boolean)
    .map(token => {
      const p = token.split("#");
      const id = (p[0] || "").trim();
      const name = p.slice(1).join("#").trim();
      const label = name || id;
      return { id, name, label, raw: token };
    });
}

function getRandomUA() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function notifyJoin(label, url) {
  // Loon通知，点击直达
  $notification.post("TestFlight 空位", label, "点击通知前往加入", {
    openUrl: url,
    mediaUrl: ICON_URL
  });
}

function checkOne(app) {
  const url = `https://testflight.apple.com/join/${app.id}`;
  const headers = {
    "User-Agent": getRandomUA(),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
  };

  return new Promise(resolve => {
    $httpClient.get(
      { url, headers, timeout: 10000, "auto-redirect": true, alpn: "h2" },
      (error, response, data) => {
        const status = response?.status ?? response?.statusCode;
        if (error) {
          console.log(`[E] ${app.raw} 请求异常: ${error}`);
          return resolve();
        }
        if (status === 404) {
          console.log(`[D] ${app.raw} → 不存在`);
          return resolve();
        }
        if (status && status !== 200) {
          console.log(`[?] ${app.raw} → HTTP ${status}`);
          return resolve();
        }
        if (!data || typeof data !== "string") {
          console.log(`[?] ${app.raw} → 响应为空或非文本`);
          return resolve();
        }

        // 判定
        if (/版本的测试员已满|This beta is full/i.test(data)) {
          console.log(`[F] ${app.raw} → 已满`);
        } else if (/版本目前不接受任何新测试员|This beta isn't accepting any new testers/i.test(data)) {
          console.log(`[N] ${app.raw} → 暂不接受新成员`);
        } else if (/要加入\s*Beta\s*版|Join the Beta|To join the/i.test(data)) {
          console.log(`[Y] ${app.raw} → 可加入`);
          notifyJoin(app.label, url);
        } else {
          // 未匹配到上面几种常见文案，视为不可加入，打印以便排查
          console.log(`[I] ${app.raw} → 未检测到可加入/满/关闭的明确文案`);
        }
        resolve();
      }
    );
  });
}

(async () => {
  const args = getArgs();
  const rawList = args.tf_app_ids || "";
  if (!rawList.trim()) {
    $notification.post("TestFlight 空位", "未配置 App ID", "请在插件参数中填写 tf_app_ids");
    return $done();
  }

  const apps = splitIds(rawList);
  console.log(`============== 即将检测的 AppId 列表 ==============`);
  console.log(apps.map(a => a.raw).join(", "));
  console.log(`===================================================`);

  for (let i = 0; i < apps.length; i++) {
    console.log(`--------- [${i + 1}/${apps.length}] ---------`);
    await checkOne(apps[i]);
  }

  $done();
})();
