let url = $request.url;
let headers = $request.headers;

if ((url.includes('ads') && url.includes('normal') && url.includes('zijieapi.com')) ||
    (url.includes('-ad-') && url.includes('byteimg.com')) ||
    (url.includes('minigame') && url.includes('zijieapi.com')) ||
    (url.includes('tnc') && (url.includes('-bjlgy') || url.includes('-alisc') || url.includes('-aliec')) &&
     (url.includes('snssdk.com') || url.includes('toutiaoapi.com') || url.includes('bytedance.com') || url.includes('zijieapi.com')))) {
  $done({ matched: true });
} else {
  $done({});
}
