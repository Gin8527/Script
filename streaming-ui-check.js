/***
 * 2024 Refactored Version
 * Removed: Dazn, Paramount, Discovery
 * Added: Claude, Gemini, Copilot, Meta AI, TikTok
 * Optimized: Full Promise-based concurrency for speed.
 */

const BASE_URL_NF = 'https://www.netflix.com/title/';
const BASE_URL_YTB = "https://www.youtube.com/premium";
const BASE_URL_DISNEY = 'https://www.disneyplus.com';
const BASE_URL_GPT = 'https://chat.openai.com/';
const BASE_URL_GPT_TRACE = 'https://chat.openai.com/cdn-cgi/trace';

// 新增检测 URL
const BASE_URL_TIKTOK = 'https://www.tiktok.com/';
const BASE_URL_CLAUDE = 'https://claude.ai/login';
const BASE_URL_GEMINI = 'https://gemini.google.com';
const BASE_URL_COPILOT = 'https://copilot.microsoft.com/';
const BASE_URL_META = 'https://www.meta.ai/';

const FILM_ID = 81280792;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const link = { "media-url": "https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/img/southpark/7.png" };
const arrow = " ➟ ";

// 状态常量
const STATUS_COMING = 2;
const STATUS_AVAILABLE = 1;
const STATUS_NOT_AVAILABLE = 0;
const STATUS_TIMEOUT = -1;
const STATUS_ERROR = -2;

var opts = {
  policy: $environment.params
};
var opts1 = {
  policy: $environment.params,
  redirection: false // 许多检测依赖重定向状态码，需要禁用自动跳转
};

// 地区 Flag 映射
var flags = new Map([
  ["AC", "🇦🇨"], ["AE", "🇦🇪"], ["AF", "🇦🇫"], ["AI", "🇦🇮"], ["AL", "🇦🇱"], ["AM", "🇦🇲"], ["AQ", "🇦🇶"], ["AR", "🇦🇷"], ["AS", "🇦🇸"], ["AT", "🇦🇹"], ["AU", "🇦🇺"], ["AW", "🇦🇼"], ["AX", "🇦🇽"], ["AZ", "🇦🇿"], ["BA", "🇧🇦"], ["BB", "🇧🇧"], ["BD", "🇧🇩"], ["BE", "🇧🇪"], ["BF", "🇧🇫"], ["BG", "🇧🇬"], ["BH", "🇧🇭"], ["BI", "🇧🇮"], ["BJ", "🇧🇯"], ["BM", "🇧🇲"], ["BN", "🇧🇳"], ["BO", "🇧🇴"], ["BR", "🇧🇷"], ["BS", "🇧🇸"], ["BT", "🇧🇹"], ["BV", "🇧🇻"], ["BW", "🇧🇼"], ["BY", "🇧🇾"], ["BZ", "🇧🇿"], ["CA", "🇨🇦"], ["CF", "🇨🇫"], ["CH", "🇨🇭"], ["CK", "🇨🇰"], ["CL", "🇨🇱"], ["CM", "🇨🇲"], ["CN", "🇨🇳"], ["CO", "🇨🇴"], ["CP", "🇨🇵"], ["CR", "🇨🇷"], ["CU", "🇨🇺"], ["CV", "🇨🇻"], ["CW", "🇨🇼"], ["CX", "🇨🇽"], ["CY", "🇨🇾"], ["CZ", "🇨🇿"], ["DE", "🇩🇪"], ["DG", "🇩🇬"], ["DJ", "🇩🇯"], ["DK", "🇩🇰"], ["DM", "🇩🇲"], ["DO", "🇩🇴"], ["DZ", "🇩🇿"], ["EA", "🇪🇦"], ["EC", "🇪🇨"], ["EE", "🇪🇪"], ["EG", "🇪🇬"], ["EH", "🇪🇭"], ["ER", "🇪🇷"], ["ES", "🇪🇸"], ["ET", "🇪🇹"], ["EU", "🇪🇺"], ["FI", "🇫🇮"], ["FJ", "🇫🇯"], ["FK", "🇫🇰"], ["FM", "🇫🇲"], ["FO", "🇫🇴"], ["FR", "🇫🇷"], ["GA", "🇬🇦"], ["GB", "🇬🇧"], ["HK", "🇭🇰"], ["HU", "🇭🇺"], ["ID", "🇮🇩"], ["IE", "🇮🇪"], ["IL", "🇮🇱"], ["IM", "🇮🇲"], ["IN", "🇮🇳"], ["IS", "🇮🇸"], ["IT", "🇮🇹"], ["JP", "🇯🇵"], ["KR", "🇰🇷"], ["LU", "🇱🇺"], ["MO", "🇲🇴"], ["MX", "🇲🇽"], ["MY", "🇲🇾"], ["NL", "🇳🇱"], ["PH", "🇵🇭"], ["RO", "🇷🇴"], ["RS", "🇷🇸"], ["RU", "🇷🇺"], ["RW", "🇷🇼"], ["SA", "🇸🇦"], ["SB", "🇸🇧"], ["SC", "🇸🇨"], ["SD", "🇸🇩"], ["SE", "🇸🇪"], ["SG", "🇸🇬"], ["TH", "🇹🇭"], ["TN", "🇹🇳"], ["TO", "🇹🇴"], ["TR", "🇹🇷"], ["TV", "🇹🇻"], ["TW", "🇨🇳"], ["UK", "🇬🇧"], ["UM", "🇺🇲"], ["US", "🇺🇸"], ["UY", "🇺🇾"], ["UZ", "🇺🇿"], ["VA", "🇻🇦"], ["VE", "🇻🇪"], ["VG", "🇻🇬"], ["VI", "🇻🇮"], ["VN", "🇻🇳"], ["ZA", "🇿🇦"]
]);

// 结果容器
let result = {
  "title": '    🚀  流媒体 & AI 服务检测',
  "YouTube": '<b>YouTube: </b>等待检测...',
  "Netflix": '<b>Netflix: </b>等待检测...',
  "Disney": "<b>Disney+: </b>等待检测...",
  "TikTok": "<b>TikTok: </b>等待检测...",
  "ChatGPT": "<b>ChatGPT: </b>等待检测...",
  "Claude": "<b>Claude: </b>等待检测...",
  "Gemini": "<b>Gemini: </b>等待检测...",
  "Copilot": "<b>Copilot: </b>等待检测...",
  "MetaAI": "<b>Meta AI: </b>等待检测..."
};

const message = {
  action: "get_policy_state",
  content: $environment.params
};

// 主逻辑
;(async () => {
  // 1. 并行执行所有检测
  // 注意：原 DisneyPlus 需要单独处理返回对象，其他直接修改 result
  let disneyCheck = testDisneyPlus();
  
  await Promise.all([
    disneyCheck,
    testNf(FILM_ID),
    testYTB(),
    testTikTok(),
    testChatGPT(),
    testClaude(),
    testGemini(),
    testCopilot(),
    testMetaAI()
  ]);

  // 2. 处理 Disney 的特殊返回逻辑
  let { region, status } = await disneyCheck;
  if (status == STATUS_COMING) {
    result["Disney"] = "<b>Disney+:</b> 即将登陆 ➟ " + '⟦' + (flags.get(region.toUpperCase()) || region) + "⟧ ⚠️";
  } else if (status == STATUS_AVAILABLE) {
    result["Disney"] = "<b>Disney+:</b> 支持 ➟ " + '⟦' + (flags.get(region.toUpperCase()) || region) + "⟧ 🎉";
  } else if (status == STATUS_NOT_AVAILABLE) {
    result["Disney"] = "<b>Disney+:</b> 未支持 🚫";
  } else if (status == STATUS_TIMEOUT) {
    result["Disney"] = "<b>Disney+:</b> 检测超时 🚦";
  }

  // 3. 构造输出内容
  // 分组：流媒体
  let mediaList = [result["YouTube"], result["Netflix"], result["Disney"], result["TikTok"]];
  // 分组：AI
  let aiList = [result["ChatGPT"], result["Claude"], result["Gemini"], result["Copilot"], result["MetaAI"]];
  
  let content = "<b>[流媒体服务]</b></br>" + mediaList.join("</br>") + 
                "</br></br><b>[人工智能]</b></br>" + aiList.join("</br>");

  content = content + "</br>------------------------------</br>" + "<font color=#CD5C5C >" + "<b>节点</b> ➟ " + $environment.params + "</font>";
  content = `<p style="text-align: left; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`;

  // 4. 发送 UI 更新
  $configuration.sendMessage(message).then(resolve => {
    if (resolve.error) {
      console.log(resolve.error);
      $done();
    }
    if (resolve.ret) {
      let output = JSON.stringify(resolve.ret[message.content]) ? JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g, "").replace(/\,/g, " ➟ ") : $environment.params;
      
      // 最终弹窗内容
      let finalContent = "<b>[流媒体服务]</b></br>" + mediaList.join("</br>") + 
                         "</br></br><b>[人工智能]</b></br>" + aiList.join("</br>");
      finalContent = finalContent + "</br>--------------------------------------</br>" + "<font color=#CD5C5C>" + "<b>节点</b> ➟ " + output + "</font>";
      finalContent = `<p style="text-align: left; font-family: -apple-system; font-size: large; font-weight: thin">` + finalContent + `</p>`;
      
      console.log("检测完成: " + output);
      $done({ "title": result["title"], "htmlMessage": finalContent });
    }
  }, reject => {
    $done();
  });
})().catch(err => {
  console.log("Global Error: " + err);
  $done();
});


// ---------------- 功能函数区 ----------------

// 通用超时控制
function timeout(delay = 5000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout');
    }, delay);
  });
}

// 1. YouTube
function testYTB() {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL_YTB,
      opts: opts,
      timeout: 5000,
      headers: { 'User-Agent': UA }
    };
    $task.fetch(option).then(response => {
      if (response.statusCode !== 200) {
        result["YouTube"] = "<b>YouTube: </b>检测失败 ❗️";
      } else if (response.body.indexOf('Premium is not available in your country') !== -1) {
        result["YouTube"] = "<b>YouTube: </b>未支持 🚫";
      } else {
        let region = '';
        let re = new RegExp('"GL":"(.*?)"', 'gm');
        let ret = re.exec(response.body);
        if (ret != null && ret.length === 2) {
          region = ret[1];
        } else if (response.body.indexOf('www.google.cn') !== -1) {
          region = 'CN';
        } else {
          region = 'US';
        }
        result["YouTube"] = "<b>YouTube: </b>支持 " + arrow + "⟦" + (flags.get(region.toUpperCase()) || region) + "⟧ 🎉";
      }
      resolve();
    }, () => {
      result["YouTube"] = "<b>YouTube: </b>检测超时 🚦";
      resolve();
    });
  });
}

// 2. Netflix
function testNf(filmId) {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL_NF + filmId,
      opts: opts,
      timeout: 5000,
      headers: { 'User-Agent': UA },
    };
    $task.fetch(option).then(response => {
      if (response.statusCode === 404) {
        result["Netflix"] = "<b>Netflix: </b>支持自制剧集 ⚠️";
      } else if (response.statusCode === 403) {
        result["Netflix"] = "<b>Netflix: </b>未支持 🚫";
      } else if (response.statusCode === 200) {
        let url = response.headers['X-Originating-URL'] || response.headers['x-originating-url'];
        let region = 'US'; // Default
        if (url) {
          region = url.split('/')[3].split('-')[0];
          if (region == 'title') region = 'us';
        }
        result["Netflix"] = "<b>Netflix: </b>完整支持" + arrow + "⟦" + (flags.get(region.toUpperCase()) || region) + "⟧ 🎉";
      } else {
        result["Netflix"] = "<b>Netflix: </b>检测异常 (" + response.statusCode + ")";
      }
      resolve();
    }, () => {
      result["Netflix"] = "<b>Netflix: </b>检测超时 🚦";
      resolve();
    });
  });
}

// 3. Disney+ (复杂逻辑保持原样)
async function testDisneyPlus() {
  try {
    let { region, cnbl } = await Promise.race([testDisneyHomePage(), timeout(7000)]);
    let { countryCode, inSupportedLocation } = await Promise.race([getDisneyLocationInfo(), timeout(7000)]);
    
    region = countryCode ?? region;
    //console.log("Disney Region: " + region);
    
    if (inSupportedLocation === false || inSupportedLocation === 'false') {
      return { region, status: STATUS_COMING };
    } else {
      return { region, status: STATUS_AVAILABLE };
    }
  } catch (error) {
    if (error === 'Not Available') return { status: STATUS_NOT_AVAILABLE };
    if (error === 'Timeout') return { status: STATUS_TIMEOUT };
    return { status: STATUS_ERROR };
  }
}

function getDisneyLocationInfo() {
  return new Promise((resolve, reject) => {
    let opts0 = {
      url: 'https://disney.api.edge.bamgrid.com/graph/v1/device/graphql',
      method: "POST",
      opts: opts,
      headers: {
        'Accept-Language': 'en',
        "Authorization": 'ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84',
        'Content-Type': 'application/json',
        'User-Agent': UA,
      },
      body: JSON.stringify({
        query: 'mutation registerDevice($input: RegisterDeviceInput!) { registerDevice(registerDevice: $input) { grant { grantType assertion } } }',
        variables: {
          input: {
            applicationRuntime: 'chrome',
            attributes: {
              browserName: 'chrome',
              browserVersion: '94.0.4606',
              manufacturer: 'apple',
              model: null,
              operatingSystem: 'macintosh',
              operatingSystemVersion: '10.15.7',
              osDeviceIds: [],
            },
            deviceFamily: 'browser',
            deviceLanguage: 'en',
            deviceProfile: 'macosx',
          },
        },
      }),
    };
    $task.fetch(opts0).then(response => {
      if (response.statusCode !== 200) {
        reject('Not Available');
      } else {
        let data = JSON.parse(response.body);
        let inSupportedLocation = data?.extensions?.sdk?.session?.inSupportedLocation;
        let countryCode = data?.extensions?.sdk?.session?.location?.countryCode;
        resolve({ inSupportedLocation, countryCode });
      }
    }, () => reject('Error'));
  });
}

function testDisneyHomePage() {
  return new Promise((resolve, reject) => {
    let opts0 = {
      url: 'https://www.disneyplus.com/',
      opts: opts,
      headers: { 'Accept-Language': 'en', 'User-Agent': UA },
    };
    $task.fetch(opts0).then(response => {
      if (response.statusCode !== 200 || response.body.indexOf('not available in your region') !== -1) {
        reject('Not Available');
      } else {
        let match = response.body.match(/Region: ([A-Za-z]{2})[\s\S]*?CNBL: ([12])/);
        if (!match) {
          resolve({ region: '', cnbl: '' });
        } else {
          resolve({ region: match[1], cnbl: match[2] });
        }
      }
    }, () => reject('Error'));
  });
}

// 4. TikTok
function testTikTok() {
  return new Promise((resolve) => {
    let option = {
      url: BASE_URL_TIKTOK,
      opts: opts1, // 禁止重定向
      headers: { 'User-Agent': UA }
    };
    $task.fetch(option).then(response => {
      // TikTok 封锁通常重定向或返回空
      if (response.statusCode === 200) {
        result["TikTok"] = "<b>TikTok: </b>支持 🎉";
      } else {
        result["TikTok"] = "<b>TikTok: </b>未支持 🚫";
      }
      resolve();
    }, () => {
      result["TikTok"] = "<b>TikTok: </b>检测超时 🚦";
      resolve();
    });
  });
}

// 5. ChatGPT (OpenAI)
function testChatGPT() {
  return new Promise((resolve) => {
    let option = {
      url: BASE_URL_GPT,
      opts: opts1,
      headers: { 'User-Agent': UA }
    };
    $task.fetch(option).then(response => {
      if (response.statusCode === 403) {
        // Cloudflare 403 意味着无法访问
        result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫 (403)";
        resolve();
      } else {
        // 进一步检测 Region
        let optionTrace = {
          url: BASE_URL_GPT_TRACE,
          opts: opts1,
          headers: { 'User-Agent': UA }
        };
        $task.fetch(optionTrace).then(resp => {
           if(resp.statusCode === 200 && resp.body.includes("loc=")) {
             let region = resp.body.split("loc=")[1].split("\n")[0];
             let flag = flags.get(region.toUpperCase()) || region;
             result["ChatGPT"] = "<b>ChatGPT: </b>支持 " + arrow + "⟦" + flag + "⟧ 🎉";
           } else {
             // 无法获取 Trace，但主页没 403，算作支持
             result["ChatGPT"] = "<b>ChatGPT: </b>支持 (未知地区) 🎉";
           }
           resolve();
        }, () => {
           result["ChatGPT"] = "<b>ChatGPT: </b>支持 (Trace超时) 🎉";
           resolve();
        });
      }
    }, () => {
      result["ChatGPT"] = "<b>ChatGPT: </b>检测超时 🚦";
      resolve();
    });
  });
}

// 6. Claude (Anthropic)
function testClaude() {
  return new Promise((resolve) => {
    let option = {
      url: BASE_URL_CLAUDE,
      opts: opts1,
      headers: { 'User-Agent': UA }
    };
    $task.fetch(option).then(response => {
      // Claude 不支持地区会返回 403 Forbidden
      if (response.statusCode !== 403) {
        result["Claude"] = "<b>Claude: </b>支持 🎉";
      } else {
        result["Claude"] = "<b>Claude: </b>未支持 🚫";
      }
      resolve();
    }, () => {
      result["Claude"] = "<b>Claude: </b>检测超时 🚦";
      resolve();
    });
  });
}

// 7. Gemini (Google)
function testGemini() {
  return new Promise((resolve) => {
    let option = {
      url: BASE_URL_GEMINI,
      opts: opts1,
      headers: { 'User-Agent': UA }
    };
    $task.fetch(option).then(response => {
      // 支持：通常 302 重定向到 accounts.google.com 登录，或者 200
      // 不支持：通常 404 或重定向到配置错误页
      if (response.statusCode === 200 || response.statusCode === 302) {
        result["Gemini"] = "<b>Gemini: </b>支持 🎉";
      } else {
        result["Gemini"] = "<b>Gemini: </b>未支持 🚫";
      }
      resolve();
    }, () => {
      result["Gemini"] = "<b>Gemini: </b>检测超时 🚦";
      resolve();
    });
  });
}

// 8. Copilot (Microsoft)
function testCopilot() {
  return new Promise((resolve) => {
    let option = {
      url: BASE_URL_COPILOT,
      opts: opts1,
      headers: { 'User-Agent': UA }
    };
    $task.fetch(option).then(response => {
      // 简单判断：Copilot 页面如果不被阻断（如CN重定向）则返回 200
      if (response.statusCode === 200) {
        result["Copilot"] = "<b>Copilot: </b>支持 🎉";
      } else {
        result["Copilot"] = "<b>Copilot: </b>未支持 🚫";
      }
      resolve();
    }, () => {
      result["Copilot"] = "<b>Copilot: </b>检测超时 🚦";
      resolve();
    });
  });
}

// 9. Meta AI
function testMetaAI() {
  return new Promise((resolve) => {
    let option = {
      url: BASE_URL_META,
      opts: opts1,
      headers: { 'User-Agent': UA }
    };
    $task.fetch(option).then(response => {
      // Meta AI 限制区域通常会重定向到 Facebook 登录或返回 403/302 到不可用页面
      if (response.statusCode === 200) {
         // 进一步检查内容，Meta 有时候 200 但显示 "Not available in your country"
         if (response.body.indexOf("not yet available") !== -1) {
             result["MetaAI"] = "<b>Meta AI: </b>未支持 🚫";
         } else {
             result["MetaAI"] = "<b>Meta AI: </b>支持 🎉";
         }
      } else if (response.statusCode === 302) {
         // 重定向到登陆通常意味着 IP 通过了基础风控
         result["MetaAI"] = "<b>Meta AI: </b>支持 (需登录) 🎉";
      } else {
         result["MetaAI"] = "<b>Meta AI: </b>未支持 🚫";
      }
      resolve();
    }, () => {
      result["MetaAI"] = "<b>Meta AI: </b>检测超时 🚦";
      resolve();
    });
  });
}