/**
 * Cloudflare 最优 IP 查询脚本 - 调试版
 */

console.log("开始查询 Cloudflare 最优 IP (调试模式)...");

const url = "https://api.uouin.com/cloudflare.html";

$httpClient.get(
  {
    url: url,
    timeout: 15000
  },
  function(error, response, data) {
    if (error) {
      console.log("❌ 请求失败: " + error);
      $done();
      return;
    }
    
    console.log("✅ 请求成功");
    console.log("数据长度: " + data.length);
    
    // 打印前1000个字符
    console.log("数据预览 (前1000字符):");
    console.log(data.substring(0, 1000));
    
    // 查找表格内容
    const tableMatch = data.match(/<table[\s\S]*?<\/table>/i);
    if (tableMatch) {
      console.log("\n✅ 找到表格");
      console.log("表格内容预览 (前500字符):");
      console.log(tableMatch[0].substring(0, 500));
    } else {
      console.log("\n❌ 未找到表格");
    }
    
    // 查找所有 IP 地址
    const ipPattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    const allIPs = data.match(ipPattern);
    
    if (allIPs) {
      console.log("\n✅ 找到 " + allIPs.length + " 个 IP 地址");
      console.log("前10个 IP:");
      allIPs.slice(0, 10).forEach(function(ip, index) {
        console.log((index + 1) + ". " + ip);
      });
    } else {
      console.log("\n❌ 未找到任何 IP 地址");
    }
    
    // 查找运营商关键词
    const carriers = ["电信", "移动", "联通", "多线"];
    carriers.forEach(function(carrier) {
      if (data.indexOf(carrier) > -1) {
        console.log("\n✅ 找到关键词: " + carrier);
        
        // 查找该关键词附近的内容
        const pos = data.indexOf(carrier);
        const context = data.substring(pos - 50, pos + 200);
        console.log("上下文:");
        console.log(context);
      } else {
        console.log("\n❌ 未找到关键词: " + carrier);
      }
    });
    
    $notification.post(
      "CF IP 调试",
      "查看日志",
      "请查看脚本日志了解详细信息"
    );
    
    $done();
  }
);
