const fs = require('fs');
const file = 'src/components/Chatbot.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/'Bonjour ! Je suis l\\'assistant de l\\'école. Comment puis-je vous aider aujourd\\'hui \?'/g, 
  '"Bonjour ! Je suis l\\'assistant de l\\'école. Comment puis-je vous aider aujourd\\'hui ?"');

content = content.replace(/l\\\\'assistant/g, "l'assistant");
content = content.replace(/l\\\\'école/g, "l'école");
content = content.replace(/aujourd\\\\'hui/g, "aujourd'hui");

fs.writeFileSync(file, content);
