// Loon Cron MD5 Monitor Script
// Description: 定时计算指定内容的MD5哈希，用于监控数据变化
// Trigger: 根据cron表达式定时执行
// Author: Generated for Loon
// Version: 1.0

const MD5 = {
    md5cycle: function(x, k) {
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

        // 第一轮
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

        // 第二轮
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

        // 第三轮
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

        // 第四轮
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
    },

    md5blk: function(s) {
        const md5blks = [];
        for (let i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) +
            (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    },

    md51: function(s) {
        const n = s.length;
        const state = [1732584193, -271733879, -1732584194, 271733878];
        let i;
        for (i = 64; i <= n; i += 64) {
            this.md5cycle(state, this.md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        const tail = new Array(16).fill(0);
        for (i = 0; i < s.length; i++) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            this.md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0;
        }
        tail[14] = n * 8;
        this.md5cycle(state, tail);
        return state;
    },

    rhex: function(n) {
        const s = "0123456789abcdef";
        let j, str = "";
        for (j = 0; j < 4; j++) {
            str += s.charAt((n >> (j * 8 + 4)) & 0x0F) +
            s.charAt((n >> (j * 8)) & 0x0F);
        }
        return str;
    },

    hex: function(x) {
        return x.map(this.rhex.bind(this)).join("");
    },

    hash: function(s) {
        return this.hex(this.md51(s));
    }
};

// Cron 脚本主逻辑
function main() {
    console.log("🚀 MD5 Cron Script Started");
    console.log("⏰ Current Time: " + new Date().toLocaleString());
    
    // 获取参数（从配置中传递）
    const input = $argument || "default_monitor_content";
    
    // 计算MD5哈希
    const md5Hash = MD5.hash(input);
    
    // 记录到持久化存储，用于比较变化
    const lastHash = $persistentStore.read("last_md5_hash");
    
    console.log("📝 Input Content: " + input);
    console.log("🔐 MD5 Hash: " + md5Hash);
    
    if (lastHash && lastHash !== md5Hash) {
        console.log("⚠️  MD5 Hash Changed!");
        console.log("📊 Previous Hash: " + lastHash);
        console.log("📈 Current Hash: " + md5Hash);
        
        // 发送通知
        $notification.post(
            "MD5监控警报", 
            "内容哈希值发生变化", 
            `原哈希: ${lastHash}\n新哈希: ${md5Hash}`,
            {
                "openUrl": "loon://",
                "clipboard": md5Hash
            }
        );
    } else if (!lastHash) {
        console.log("📋 First Run - Storing Initial Hash");
    } else {
        console.log("✅ MD5 Hash Unchanged");
    }
    
    // 存储当前哈希
    $persistentStore.write(md5Hash, "last_md5_hash");
    
    console.log("✅ MD5 Cron Script Completed");
}

// 执行主函数
main();
$done();