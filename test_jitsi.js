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

check('meet.jit.si');
check('meet.ffmuc.net');
check('framatalk.org');
check('meet.hostpoint.ch');
check('meet.artemis.mutu.io');
check('jitsi.riot.im');
