// Surge 脚本: Telegram 跳转重定向
// 适配 Surge 的参数传递方式

// 读取 argument 参数，如果没有传参则默认为 Swiftgram
let scheme = typeof $argument !== "undefined" ? $argument : "Swiftgram";

// 预定义映射关系
const mapping = {
    "Telegram": "tg",
    "Swiftgram": "sg",
    "Turrit": "turrit",
    "iMe": "ime",
    "Nicegram": "ng",
    "Lingogram": "lingo"
};

// 检查并转换参数 (例如将 "Swiftgram" 转为 "sg")
scheme = mapping[scheme] || scheme;

// 获取当前请求的 URL
let url = $request.url;

// 正则匹配 t.me/xxx (兼容 http 和 https)
let match = url.match(/(?:https?:\/\/)?t\.me\/(.+)/);

if (match) {
    // 构造新的 URL 地址 (tg://resolve?domain=xxx)
    let newUrl = `${scheme}://resolve?domain=${match[1]}`;

    // 修改响应的 Location header 进行 307 重定向
    $done({
        status: 307,
        headers: {
            'Location': newUrl
        }
    });
} else {
    // 不匹配则不做处理
    $done({});
}
