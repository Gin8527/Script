let url = $request.url;
let match = url.match(/(?:https?:\/\/)?t\.me\/(.+)/);

if (match) {
    // 如果要用 Swiftgram 改成 sg，Turrit 改成 turrit
    let newUrl = `turrit://resolve?domain=${match[1]}`;
    $done({
        response: {
            status: 302,
            headers: {
                "Location": newUrl
            },
            body: ""
        }
    });
} else {
    $done({});
}
