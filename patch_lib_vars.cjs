const fs = require('fs');
const file = 'src/components/views/LibraryView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "    } else {\n      showToast(`Demande d'achat pour {item.title} ({item.price}) envoyée à la comptabilité.`);\n    }",
  "    } else {\n      showToast(`Demande d'achat pour ${item.title} (${item.price}$) envoyée à la comptabilité.`);\n    }"
);

content = content.replace(
  "{item.price === 0 ? 'Gratuit' : `{item.price} `}",
  "{item.price === 0 ? 'Gratuit' : `${item.price} $`}"
);

fs.writeFileSync(file, content);
