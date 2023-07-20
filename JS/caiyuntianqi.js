/********************** SCRIPT START *********************************/
const $ = API("fmqppLgQRcTNFjpB");
const ERR = MYERR();

let display_location = $.read("display_location");
if (display_location === undefined) {
  display_location = false;
} else {
  display_location = JSON.parse(display_location);
}
if (typeof $request !== "undefined") {
  const url = $request.url;
  const res =
    url.match(/weather\/.*?\/(.*)\/(.*)\?/) ||
    url.match(/geocode\/([0-9.]*)\/([0-9.]*)\//) ||
    url.match(/geocode=([0-9.]*),([0-9.]*)/) ||
    url.match(/v2\/availability\/([0-9.]*)\/([0-9.]*)\//);
  if (res === null) {
    $.info(`❌ 正则表达式匹配错误，🥬 无法从URL: ${url} 获取位置。`);
    $.done({ body: $request.body });
  }
  const location = {
    latitude: res[1],
    longitude: res[2],
  };
  if (!$.read("location")) {
    $.notify("[彩云天气]", "", "🎉🎉🎉 获取定位成功。");
  }
  if (display_location) {
    $.info(
      `成功获取当前位置：纬度 ${location.latitude} 经度 ${location.longitude}`
    );
  }

  $.write(res[1], "#latitude");
  $.write(res[2], "#longitude");

  $.write(location, "location");
  $.done({ body: $request.body });
} else {
  // this is a task
  !(async () => {
    const { caiyun, tencent } = $.read("token") || {};

    if (!caiyun) {
      throw new ERR.TokenError("❌ 未找到彩云Token令牌");
    } else if (caiyun.indexOf("http") !== -1) {
      throw new ERR.TokenError("❌ Token令牌 并不是 一个链接！");
    } else if (!tencent) {
      throw new ERR.TokenError("❌ 未找到腾讯地图Token令牌");
    } else if (!$.read("location")) {
      // no location
      $.notify(
        "[彩云天气]",
        "❌ 未找到定位",
        "🤖 您可能没有正确设置MITM，请检查重写是否成功。"
      );
    } else {
      await scheduler();
    }
  })()
    .catch((err) => {
      if (err instanceof ERR.TokenError)
        $.notify(
          "[彩云天气]",
          err.message,
          "🤖 由于API Token具有时效性，请前往\nhttps://t.me/cool_scripts\n获取最新Token。",
          {
            "open-url": "https://t.me/cool_scripts",
          }
        );
      else $.notify("[彩云天气]", "❌ 出现错误", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    })
    .finally(() => $.done());
}
async function scheduler() {
  const now = new Date();
  $.log(
    `Scheduler activated at ${now.getMonth() + 1}月${now.getDate()}日${now.getHours()}时${now.getMinutes()}分`
  );
  await query();
  weatherAlert();
  realtimeWeather();
}

async function query() {
  // ...query函数实现
}

function weatherAlert() {
  // ...weatherAlert函数实现
}

function realtimeWeather() {
  // ...realtimeWeather函数实现
}
/************************** 天气对照表 *********************************/

function mapAlertCode(code) {
  // ...mapAlertCode函数实现
}

function mapWind(speed, direction) {
  // ...mapWind函数实现
}

function mapSkycon(skycon) {
  // ...mapSkycon函数实现
}

function mapPrecipitation(intensity) {
  // ...mapPrecipitation函数实现
}

function mapIntensity(breakpoints) {
  // ...mapIntensity函数实现
}

/************************** ERROR *********************************/

function MYERR() {
  class TokenError extends Error {
    constructor(message) {
      super(message);
      this.name = "TokenError";
    }
  }

  return {
    TokenError,
  };
}
/*********************************** API *************************************/

function ENV() {
  const e = "undefined" != typeof $task,
    t = "undefined" != typeof $loon,
    s = "undefined" != typeof $httpClient && !t,
    i = "function" == typeof require && "undefined" != typeof $jsbox;
  return { isQX: e, isLoon: t, isSurge: s, isNode: "function" == typeof require && !i, isJSBox: i, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule };
}

function HTTP(e = { baseURL: "" }) {
  const { isQX: t, isLoon: s, isSurge: i, isScriptable: n, isNode: o } = ENV();
  const r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;
  const u = {};
  return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(l => u[l.toLowerCase()] = (u => (function (u, l) {
    l = "string" == typeof l ? { url: l } : l;
    const h = e.baseURL;
    h && !r.test(l.url || "") && (l.url = h ? h + l.url : l.url);
    const a = (l = { ...e, ...l }).timeout,
      c = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...l.events };
    let f, d;
    if (c.onRequest(u, l), t) f = $task.fetch({ method: u, ...l });
    else if (s || i || o) f = new Promise((e, t) => { (o ? require("request") : $httpClient)[u.toLowerCase()](l, (s, i, n) => { s ? t(s) : e({ statusCode: i.status || i.statusCode, headers: i.headers, body: n }) }) });
    else if (n) {
      const e = new Request(l.url);
      e.method = u, e.headers = l.headers, e.body = l.body;
      f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) })
    }
    const p = a ? new Promise((e, t) => { d = setTimeout(() => (c.onTimeout(), t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)), a) }) : null;
    return (p ? Promise.race([p, f]).then(e => (clearTimeout(d), e)) : f).then(e => c.onResponse(e))
  })(l, u))), u
}

function API(e = "untitled", t = !1) {
  const { isQX: s, isLoon: i, isSurge: n, isNode: o, isJSBox: r, isScriptable: u } = ENV();
  return new class {
    constructor(e, t) {
      this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => {
        if (o) {
          return { fs: require("fs") }
        }
        return null
      })(), this.initCache();
      Promise.prototype.delay = function (e) {
        return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) })
      }
    }

    initCache() {
      if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (i || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), o) {
        let e = "root.json";
        this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {};
        e = `${this.name}.json`;
        this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {})
      }
      r && (this.cache = JSON.parse($file.read(this.name).string || "{}"))
    }

    persistCache() {
      const e = JSON.stringify(this.cache, null, 2);
      s && $prefs.setValueForKey(e, this.name), (i || n) && $persistentStore.write(e, this.name), o && this.node.fs.writeFileSync(`${this.name}.json`, e, e => console.log(e)), r && $file.write(this.name, $data({ string: e }))
    }

    write(e, t) {
      this.cache[e] = t, this.persistCache()
    }

    read(e) {
      return this.cache[e]
    }

    delete(e) {
      delete this.cache[e], this.persistCache()
    }

    notify(e, t, s, i) {
      if (s) {
        if (this.debug || t.includes("❌")) {
          let i = t ? `${t} - ${e}` : e, n = s;
          o || r ? console.log(`${i}\n${n}`) : this.msg(i, n)
        }
        if (s.includes("❌")) {
          const i = t ? `${t} - ${e}` : e;
          $notify(i, "", s)
        }
        o || r ? $done({}) : this.done()
      } else
        s = e, $notify(this.name, t, s)
    }

    done(e = {}) {
      if (o || r) console.log("done", JSON.stringify(Object.assign({ status: "DONE" }, e), null, 2));
      else {
        let t = Object.assign({ status: "DONE" }, e);
        $done(t)
      }
    }

    msg(e, t) {
      $push.schedule({ title: e, body: t })
    }

    info(e) {
      console.log("INFO", e)
    }

    error(e) {
      console.log("ERROR", e)
    }
  }(e, t)
}
