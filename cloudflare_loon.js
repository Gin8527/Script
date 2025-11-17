/**
 * Cloudflare 最优 IP 查询脚本 (Loon - 表格解析修正版)
 * 用法：在 [Script] 配置为 cron 任务
 */

console.log("开始查询 Cloudflare 最优 IP...");

const url = "https://api.uouin.com/cloudflare.html";

// IPv4 校验
const ipv4Re = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

// 统一运营商名称
function normalizeCarrier(s) {
  if (!s) return "";
  s = s.replace(/\s+/g, "").trim();
  if (s.includes("电信")) return "电信";
  if (s.includes("移动")) return "移动";
  if (s.includes("联通")) return "联通";
  if (s.includes("多线")) return "多线";
  return s;
}

$httpClient.get(
  {
    url,
    timeout: 15000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
      Accept: "text/html"
    }
  },
  function (error, response, data) {
    if (error) {
      console.log("❌ 请求失败: " + error);
      $notification.post("CF 最优 IP 查询", "❌ 请求失败", String(error));
      $done();
      return;
    }

    try {
      // 提取整张表
      const tableMatch = data && data.match(/<table[\s\S]*?<\/table>/i);
      if (!tableMatch) throw new Error("未找到表格数据");

      const tableHtml = tableMatch[0];

      // 拆出所有行
      const rows = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];
      if (rows.length < 2) throw new Error("表格没有数据行");

      // 只提取 <td> 的文本（跳过表头 <th>）
      function extractTdsText(rowHtml) {
        const tds = [];
        const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        let m;
        while ((m = tdRe.exec(rowHtml)) !== null) {
          // 去标签、压空白
          const txt = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          tds.push(txt);
        }
        return tds;
      }

      const wanted = { 电信: null, 移动: null, 联通: null, 多线: null };
      let pickedCount = 0;

      // 从第二行起处理（第一行是表头）
      for (let i = 1; i < rows.length; i++) {
        const cells = extractTdsText(rows[i]);
        // 期望：cells[0]=线路, cells[1]=IP
        if (cells.length < 2) continue;

        const carrier = normalizeCarrier(cells[0]);
        const ip = (cells[1] || "").trim();

        if (!["电信", "移动", "联通", "多线"].includes(carrier)) continue;
        if (!ipv4Re.test(ip)) continue;

        if (!wanted[carrier]) {
          wanted[carrier] = ip;
          pickedCount++;
          console.log(`找到 ${carrier} IP: ${ip}`);
          // 优化：四类都找齐就停止
          if (pickedCount >= 4) break;
        }
      }

      // 如果四类都没解析到，兜底：抓取页面所有 IPv4
      let message = "";
      if (!wanted.电信 && !wanted.移动 && !wanted.联通 && !wanted.多线) {
        console.log("未解析到按运营商分类的 IP，启用兜底方案...");
        const allIPs = (data.match(/\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g) || []);
        const uniqIPs = Array.from(new Set(allIPs));
        if (uniqIPs.length === 0) throw new Error("页面中未找到任何 IPv4 地址");

        message =
          "🌐 推荐IP(前5个):\n" + uniqIPs.slice(0, 5).join("\n") +
          `\n\n共找到 ${uniqIPs.length} 个 IP`;

        // 保存兜底结果
        $persistentStore.write(uniqIPs[0], "cf_best_ip_recommended");
        $persistentStore.write(uniqIPs.slice(0, 10).join(","), "cf_best_ip_list");

        $notification.post("CF 最优 IP", "✅ 查询成功(兜底)", message);
        console.log("✅ 查询成功(兜底)\n" + message);
      } else {
        message =
          `📡 电信推荐: ${wanted.电信 || "未找到"}\n` +
          `📱 移动推荐: ${wanted.移动 || "未找到"}\n` +
          `📱 联通推荐: ${wanted.联通 || "未找到"}\n` +
          `🌐 多线推荐: ${wanted.多线 || "未找到"}`;

        if (wanted.电信) $persistentStore.write(wanted.电信, "cf_best_ip_ctcc");
        if (wanted.移动) $persistentStore.write(wanted.移动, "cf_best_ip_cmcc");
        if (wanted.联通) $persistentStore.write(wanted.联通, "cf_best_ip_cucc");
        if (wanted.多线) $persistentStore.write(wanted.多线, "cf_best_ip_multiline");

        $notification.post("CF 最优 IP", "✅ 查询成功", message);
        console.log("✅ 查询成功\n" + message);
      }

      // 写入更新时间
      const now = new Date();
      const timeStr = now.toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
      $persistentStore.write(timeStr, "cf_best_ip_update_time");
      console.log("更新时间: " + timeStr);
    } catch (e) {
      console.log("❌ 解析失败: " + e.message);
      $notification.post("CF 最优 IP 查询", "❌ 解析失败", e.message);
    }

    $done();
  }
);
