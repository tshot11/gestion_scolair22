const https = require('https');

async function check(host) {
  return new Promise((resolve) => {
    const req = https.get('https://' + host, { timeout: 3000 }, (res) => {
      const xframe = res.headers['x-frame-options'];
      const csp = res.headers['content-security-policy'];
      console.log(host, "X-Frame-Options:", xframe, "CSP:", csp);
      res.destroy();
      resolve();
    }).on('error', (e) => {
      console.error(host, e.message);
      resolve();
    }).on('timeout', () => {
      req.destroy();
      resolve();
    });
  });
}

(async () => {
  await check('jitsi.riot.im');
  await check('meet.systemli.org');
  await check('meet.waartaa.com');
  await check('video.linux.it');
  await check('meet.tico.chat');
  await check('jitsi.hamburg.ccc.de');
  await check('meet.nixnet.services');
  await check('meet.element.io');
  await check('call.nxy.io');
  await check('jitsi.adminforge.de');
  process.exit(0);
})();
