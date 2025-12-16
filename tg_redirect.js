// Surge 脚本: t.me 重定向
// 这里的 $argument 接收模块中传入的参数，默认为 Swiftgram

let scheme = typeof $argument !== "undefined" ? $argument : "Swiftgram";

const mapping = {
    "Telegram": "tg",
    "Swiftgram": "sg",
    "Turrit": "turrit",
    "iMe": "ime",
    "Nicegram": "ng",
    "Lingogram": "lingo"
};

// 容错处理：如果传入的是全名，转为 scheme；如果已经是 scheme，则保留
scheme = mapping[scheme] || scheme;

let url = $request.url;
// 匹配 t.me/xxx
let match = url.match(/(?:https?:\/\/)?t\.me\/(.+)/);

if (match) {
    let newUrl = `${scheme}://resolve?domain=${match[1]}`;
    $done({
        status: 307,
        headers: {
            Location: newUrl
        }
    });
} else {
    $done({});
}
