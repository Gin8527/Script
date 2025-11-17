/**
 * Cloudflare 最优 IP 查询脚本 (Loon版本 - 改进版)
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
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  },
  function(error, response, data) {
    if (error) {
      console.log("❌ 请求失败: " + error);
      $notification.post(
        "CF 最优 IP 查询",
        "❌ 网络请求失败",
        error
      );
      $done();
      return;
    }
    
    try {
      console.log("收到数据，开始解析...");
      
      // 改进的解析函数
      function extractBestIP(html, carrier) {
        // 移除所有换行和多余空格，便于匹配
        const cleanHtml = html.replace(/\s+/g, ' ');
        
        // 匹配模式：<td>运营商</td><td>IP地址</td>
        // 使用更宽松的正则表达式
        const pattern = '<td>' + carrier + '</td>\\s*<td>([0-9\\.]+)</td>';
        const regex = new RegExp(pattern, 'i');
        const match = cleanHtml.match(regex);
        
        if (match && match[1]) {
          console.log("找到 " + carrier + " IP: " + match[1]);
          return match[1];
        }
        
        console.log("未找到 " + carrier + " 的 IP");
        return null;
      }
      
      // 提取各运营商的 IP
      const ctcc = extractBestIP(data, "电信");
      const cmcc = extractBestIP(data, "移动");
      const cucc = extractBestIP(data, "联通");
      const multiline = extractBestIP(data, "多线");
      
      // 检查是否至少找到一个 IP
      if (!ctcc && !cmcc && !cucc && !multiline) {
        // 如果都没找到，尝试直接提取所有 IP 地址
        console.log("尝试使用备用方案提取 IP...");
        
        const ipPattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
        const allIPs = data.match(ipPattern);
        
        if (allIPs && allIPs.length > 0) {
          // 去重
          const uniqueIPs = [...new Set(allIPs)];
          console.log("找到 " + uniqueIPs.length + " 个 IP 地址");
          
          const message = 
            `🌐 推荐IP (前5个):\n` +
            uniqueIPs.slice(0, 5).join('\n') +
            `\n\n共找到 ${uniqueIPs.length} 个可用IP`;
          
          $notification.post("CF 最优 IP", "✅ 查询成功", message);
          
          // 保存第一个 IP 到所有分类
          $persistentStore.write(uniqueIPs[0], "cf_best_ip_recommended");
          $persistentStore.write(uniqueIPs.slice(0, 10).join(','), "cf_best_ip_list");
          
          console.log("✅ 使用备用方案成功");
          console.log(message);
          
          const now = new Date();
          const timeStr = now.toLocaleString('zh-CN', { 
            timeZone: 'Asia/Shanghai'
          });
          $persistentStore.write(timeStr, "cf_best_ip_update_time");
          
          $done();
          return;
        }
        
        throw new Error("未能从页面中提取到任何 IP 地址");
      }
      
      // 如果找到了运营商 IP
      const message = 
        `📡 电信推荐: ${ctcc || '未找到'}\n` +
        `📱 移动推荐: ${cmcc || '未找到'}\n` +
        `📱 联通推荐: ${cucc || '未找到'}\n` +
        `🌐 多线推荐: ${multiline || '未找到'}`;
      
      // 保存到本地存储
      if (ctcc) $persistentStore.write(ctcc, "cf_best_ip_ctcc");
      if (cmcc) $persistentStore.write(cmcc, "cf_best_ip_cmcc");
      if (cucc) $persistentStore.write(cucc, "cf_best_ip_cucc");
      if (multiline) $persistentStore.write(multiline, "cf_best_ip_multiline");
      
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
      console.log("错误堆栈: " + e.stack);
      
      $notification.post(
        "CF 最优 IP 查询",
        "❌ 数据解析失败",
        e.message
      );
    }
    
    $done();
  }
);
