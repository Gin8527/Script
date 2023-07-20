const appName = "AppSliced";

$httpClient.get("https://appsliced.co/apps?sort=latest&threshold=all&price=free&l=nav", function(error, response, body) {
  if (error) {
    $.log(error);
    $.msg(appName, "❌ Network Error", error);
    $.done();
  } else {
    $.log("🚧 Getting AppSliced daily free apps...\n");
    // $.log(body);

    try {
      const appsData = JSON.parse(body);
      if (appsData && appsData.items && appsData.items.length > 0) {
        const apps = appsData.items;
        let notice = "";
        for (const app of apps) {
          const link = `https://apps.apple.com/us/app/id${app.id}\n`;
          const name = `🟢${app.name}`;
          notice += name + "\n" + link + "\n";
        }
        $.log(notice);
        $.msg(appName, "Today's Free Apps are ready, click to view details👇", notice);
        $.console.log(appName, "Today's Free Apps are ready, click to view details👇", notice);
        $.done();
      } else {
        $.log("🔴 Failed to get app information!");
        $.log(body);
        $.msg(appName, "🔴 Failed to get app information!");
        $.done();
      }
    } catch (e) {
      $.log("🔴 Error parsing JSON response!");
      $.log(body);
      $.msg(appName, "🔴 Error parsing JSON response!");
      $.done();
    }
  }
});
