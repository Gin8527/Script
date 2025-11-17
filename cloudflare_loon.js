/**
 * Cloudflare 最优 IP 查询脚本 (Loon版本 - HTML解析版)
 * 脚本类型: Cron
 * 配置示例: cron "0 8 * * *" script-path=cloudflare_best_ip.js, tag=CF最优IP, enable=true
 */

console.log("开始查询 Cloudflare 最优 IP...");

// 直接访问 HTML 页面并解析
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
      // 解析 HTML 中的表格数据
      function extractIP(html, carrier) {
        const regex = new RegExp('<td>' + carrier + '</td>\\s*<td>([0-9.]+)</td>', 'g');
        const matches = [];
        let match;
        
        while ((match = regex.exec(html)) !== null) {
          matches.push(match[1]);
        }
        
        return matches.length > 0 ? matches[0] : "未找到";
      }
      
      const ctcc = extractIP(data, "电信");
      const cmcc = extractIP(data, "移动");
      const cucc = extractIP(data, "联通");
      const cernet = extractIP(data, "多线"); // 使用多线作为通用推荐
      
      const message = 
        `📡 电信推荐: ${ctcc}\n` +
        `📱 移动推荐: ${cmcc}\n` +
        `📱 联通推荐: ${cucc}\n` +
        `🌐 多线推荐: ${cernet}`;
      
      // 保存到本地存储
      $persistentStore.write(ctcc, "cf_best_ip_ctcc");
      $persistentStore.write(cmcc, "cf_best_ip_cmcc");
      $persistentStore.write(cucc, "cf_best_ip_cucc");
      $persistentStore.write(cernet, "cf_best_ip_cernet");
      
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
        "❌ 数据解析失败",
        e.message
      );
    }
    
    $done();
  }
);
