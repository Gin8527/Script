/**
 * Cloudflare 最优 IP 查询脚本 (Loon版本)
 * 脚本类型: Cron
 * 配置示例: cron "0 8 * * *" script-path=cloudflare_best_ip.js, tag=CF最优IP, enable=true
 */

// MD5 函数实现
function md5cycle(x, k) {
  let a = x[0], b = x[1], c = x[2], d = x[3];
  
  function cmn(q, a, b, x, s, t) {
    a = (a + q + x + t) | 0;
    return (((a << s) | (a >>> (32 - s))) + b) | 0;
  }
  
  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  
  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  
  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  
  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = (a + x[0]) | 0;
  x[1] = (b + x[1]) | 0;
  x[2] = (c + x[2]) | 0;
  x[3] = (d + x[3]) | 0;
}

function md5blk(s) {
  const md5blks = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i) + 
                       (s.charCodeAt(i + 1) << 8) + 
                       (s.charCodeAt(i + 2) << 16) + 
                       (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

function md51(s) {
  const n = s.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  
  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  
  s = s.substring(i - 64);
  const tail = new Array(16).fill(0);
  
  for (i = 0; i < s.length; i++) {
    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  }
  
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}

function rhex(n) {
  const s = '0123456789abcdef';
  let str = '';
  for (let j = 0; j < 4; j++) {
    str += s.charAt((n >> (j * 8 + 4)) & 0x0F) + 
           s.charAt((n >> (j * 8)) & 0x0F);
  }
  return str;
}

function hex(x) {
  return x.map(rhex).join('');
}

function md5(s) {
  return hex(md51(s));
}

// 计算最佳 IP
function getBestIPByScore(dataList) {
  if (!dataList || dataList.length === 0) {
    return "无数据";
  }
  
  const validIPs = dataList.filter(item => item.status === "reachable");
  
  if (validIPs.length === 0) {
    return "无可用IP";
  }
  
  const scoredIPs = validIPs.map(item => {
    const ping = parseFloat(item.ping);
    const bandwidth = parseFloat(item.bandwidth.replace("mb", ""));
    const score = (100 - ping) * 0.5 + bandwidth * 0.5;
    
    return {
      ip: item.ip,
      ping: ping,
      bandwidth: bandwidth,
      score: score
    };
  });
  
  const sorted = scoredIPs.sort((a, b) => b.score - a.score);
  return sorted[0].ip;
}

// 主逻辑
const time = Date.now().toString();
const key = md5(md5("DdlTxtN0sUOu") + "70cloudflareapikey" + time);
const url = `https://api.uouin.com/api/info?key=${key}&timestamp=${time}`;

console.log("开始查询 Cloudflare 最优 IP...");
console.log("请求 URL: " + url);

// 发起请求
$httpClient.get(
  {
    url: url,
    timeout: 15000,
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Referer": "https://api.uouin.com/cloudflare.html",
      "Origin": "https://api.uouin.com",
      "X-Requested-With": "XMLHttpRequest"
    }
  },
  function(error, response, data) {
    if (error) {
      console.log("❌ 请求失败: " + error);
      $notification.post(
        "CF 最优 IP 查询",
        "❌ 网络请求失败",
        "错误信息: " + error
      );
      $done();
      return;
    }
    
    // 打印响应状态
    console.log("响应状态: " + (response ? response.status : "无响应"));
    
    // 打印响应数据的前100个字符用于调试
    if (data) {
      console.log("响应数据前100字符: " + data.substring(0, 100));
    } else {
      console.log("响应数据为空");
    }
    
    // 检查响应状态
    if (response && response.status !== 200) {
      console.log("❌ HTTP状态码异常: " + response.status);
      $notification.post(
        "CF 最优 IP 查询",
        "❌ 服务器响应异常",
        "HTTP状态码: " + response.status
      );
      $done();
      return;
    }
    
    try {
      // 检查返回的数据是否为 HTML
      if (data && data.trim().startsWith('<')) {
        throw new Error("API返回了HTML页面，可能是接口限制或错误");
      }
      
      // 尝试解析 JSON
      const result = JSON.parse(data);
      console.log("JSON 解析成功");
      
      // 检查数据结构
      if (!result.data) {
        throw new Error("API 返回数据格式错误: 缺少 data 字段");
      }
      
      const ipData = result.data;
      
      // 检查各运营商数据是否存在
      if (!ipData.ctcc || !ipData.cmcc || !ipData.cucc || !ipData.cernet) {
        throw new Error("API 返回数据不完整，缺少运营商数据");
      }
      
      // 获取各运营商最优 IP
      const ctcc = getBestIPByScore(ipData.ctcc?.info);
      const cmcc = getBestIPByScore(ipData.cmcc?.info);
      const cucc = getBestIPByScore(ipData.cucc?.info);
      const cernet = getBestIPByScore(ipData.cernet?.info);
      
      // 构建消息
      const message = 
        `📡 电信推荐: ${ctcc}\n` +
        `📱 移动推荐: ${cmcc}\n` +
        `📱 联通推荐: ${cucc}\n` +
        `🎓 教育网推荐: ${cernet}`;
      
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
      console.log("完整错误信息: " + e.stack);
      
      // 打印完整响应数据用于调试
      if (data) {
        console.log("完整响应数据: " + data);
      }
      
      $notification.post(
        "CF 最优 IP 查询",
        "❌ 数据解析失败",
        e.message + "\n\n请检查 API 接口是否正常"
      );
    }
    
    $done();
  }
);
