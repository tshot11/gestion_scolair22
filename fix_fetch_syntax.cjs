const fs = require('fs');

let content = fs.readFileSync('src/components/views/UserManagementView.jsx', 'utf8');

const badFetch = `        const res = await fetch('/api/users', {
        headers: { "Authorization": \`Bearer \${localStorage.getItem("auth_token")}\` }
      }, {
          method: 'POST',
          headers: { "Content-Type": "application/json", "Authorization": \`Bearer \${localStorage.getItem("auth_token")}\` },
          body: JSON.stringify(form)
        });`;

const fixedFetch = `        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { "Content-Type": "application/json", "Authorization": \`Bearer \${localStorage.getItem("auth_token")}\` },
          body: JSON.stringify(form)
        });`;

content = content.replace(badFetch, fixedFetch);

fs.writeFileSync('src/components/views/UserManagementView.jsx', content);
