const https = require('https');

function check(host) {
  https.get('https://' + host, (res) => {
    const xframe = res.headers['x-frame-options'];
    const csp = res.headers['content-security-policy'];
    console.log(host, "X-Frame-Options:", xframe, "CSP:", csp);
  }).on('error', (e) => {
    console.error(host, e.message);
  });
}

check('jitsi.riot.im');
check('meet.systemli.org');
check('meet.waartaa.com');
check('video.linux.it');
check('meet.tico.chat');
check('jitsi.hamburg.ccc.de');
