const fs = require('fs');
const file = 'server/routes.js';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('@google/genai')) {
  content = content.replace("import { User, Student, AuditLog, Payment } from './models.js';", 
    "import { User, Student, AuditLog, Payment } from './models.js';\nimport { GoogleGenAI } from '@google/genai';");
}

// Add chat route
const chatRoute = `
let ai = null;

router.post('/chat', async (req, res) => {
  try {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'La clé API Gemini n\\'est pas configurée sur le serveur.' });
      }
      ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }

    const { message, contextData } = req.body;
    
    // Create prompt with system instruction
    const prompt = \`
Tu es l'assistant virtuel intelligent de l'application de Gestion Scolaire RDC.
Ton rôle est d'aider les utilisateurs (parents, enseignants, administrateurs) à naviguer dans l'application et à trouver des informations.
Réponds de manière concise, polie et utile en français.

Voici quelques informations de contexte sur l'application actuelle :
\${contextData || 'Aucune donnée spécifique fournie.'}

Question de l'utilisateur : \${message}
\`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error('Erreur Chatbot:', err);
    res.status(500).json({ error: 'Erreur lors de la communication avec l\\'assistant.' });
  }
});
`;

if (!content.includes('/chat')) {
  content = content.replace('export default router;', chatRoute + '\nexport default router;');
  fs.writeFileSync(file, content);
}

