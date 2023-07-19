const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke';

$httpClient.get(JOKE_API_URL, (error, response, body) => {
  if (error) {
    console.error('获取笑话失败:', error);
    $done();
    return;
  }

  const jokeData = JSON.parse(body);
  const setup = jokeData.setup;
  const punchline = jokeData.punchline;
  const joke = `${setup}\n\n${punchline}`;

  $notification.post('笑话', '', joke);
  $done({ result: joke });
});
