/**
 * Cloudflare 最优 IP 查询脚本 (Loon版本 - 最终版)
 * 脚本类型: Cron
 * 配置示例: cron "0 8 * * *" script-path=cloudflare_best_ip.js, tag=CF最优IP, enable=true
 */

console.log("开始查询 Cloudflare 最优 IP...");

const url = "https://api.uouin.com/cloudflare.html";

$httpClient.get(
  {
    url: url,
    timeout: 15000,
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
      "Accept": "text/html"
    }
  },
  function(error, response, data) {
    if (error) {
      console.log("❌ 请求失败: " + error);
      $notification.post("CF 最优 IP 查询", "❌ 请求失败", error);
      $done();
      return;
    }
    
    try {
      console.log("✅ 获取数据成功，开始解析...");
      
      // 提取表格内容
      const tableMatch = data.match(/<table[\s\S]*?<\/table>/i);
      if (!tableMatch) {
        throw new Error("未找到表格数据");
      }
      
      const tableHtml = tableMatch[0];
      console.log("✅ 找到表格");
      
      // 提取所有表格行
      const rowPattern = /<tr[\s\S]*?<\/tr>/gi;
      const rows = tableHtml.match(rowPattern);
      
      if (!rows || rows.length < 2) {
        throw new Error("表格数据为空");
      }
      
      console.log("找到 " + rows.length + " 行数据");
      
      // 存储各运营商的第一个 IP
      const ips = {
        "电信": null,
        "移动": null,
        "联通": null,
        "多线": null
      };
      
      // 解析每一行
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        
        // 提取所有 td 内容
        const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        const cells = [];
        let cellMatch;
        
        while ((cellMatch = tdPattern.exec(row)) !== null) {
          // 清理 HTML 标签和空格
          const cellContent = cellMatch[1]
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          cells.push(cellContent);
        }
        
        // cells 结构: [序号, 线路, IP, 丢包, 延迟, 速度, 带宽, Colo, 时间]
        if (cells.length >= 3) {
          const carrier = cells[1]; // 线路
          const ip = cells[2];      // IP
          
          // 验证 IP 格式
          const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          
          if (ipPattern.test(ip)) {
            // 保存每个运营商的第一个 IP
            if (ips[carrier] === null) {
              ips[carrier] = ip;
              console.log("找到 " + carrier + " IP: " + ip);
            }
          }
        }
      }
      
      // 检查是否找到了 IP
      const foundAny = ips["电信"] || ips["移动"] || ips["联通"] || ips["多线"];
      
      if (!foundAny) {
        throw new Error("未能解析出任何运营商 IP");
      }
      
      // 构建消息
      const message = 
        `📡 电信推荐: ${ips["电信"] || '未找到'}\n` +
        `📱 移动推荐: ${ips["移动"] || '未找到'}\n` +
        `📱 联通推荐: ${ips["联通"] || '未找到'}\n` +
        `🌐 多线推荐: ${ips["多线"] || '未找到'}`;
      
      // 保存到本地存储
      if (ips["电信"]) $persistentStore.write(ips["电信"], "cf_best_ip_ctcc");
      if (ips["移动"]) $persistentStore.write(ips["移动"], "cf_best_ip_cmcc");
      if (ips["联通"]) $persistentStore.write(ips["联通"], "cf_best_ip_cucc");
      if (ips["多线"]) $persistentStore.write(ips["多线"], "cf_best_ip_multiline");
      
      // 保存查询时间
      const now = new Date();
      const timeStr = now.toLocaleString('zh-CN', { 
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      $persistentStore.write(timeStr, "cf_best_ip_update_time");
      
      // 发送通知
      $notification.post("CF 最优 IP", "✅ 查询成功", message);
      
      console.log("✅ 查询成功:");
      console.log(message);
      console.log("更新时间: " + timeStr);
      
    } catch (e) {
      console.log("❌ 解析失败: " + e.message);
      $notification.post(
        "CF 最优 IP 查询",
        "❌ 解析失败",
        e.message
      );
    }
    
    $done();
  }
);
