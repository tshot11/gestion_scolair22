import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { sequelize } from './server/models.js';
import { initDB } from './server/seed.js';
import apiRoutes from './server/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configuration de base
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  // Initialisation de la Base de données (SQLite)
  try {
    await sequelize.authenticate();
    console.log('Connexion à SQLite réussie.');
    await initDB();
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }

  // Route pour télécharger le ZIP
  app.get('/download-zip', (req, res) => {
    res.download(path.join(process.cwd(), 'Gestion-Scolaire-Source.zip'));
  });

  // Routes API REST Sécurisées
  app.use('/api', apiRoutes);

  // Intégration Vite pour le Frontend React (Mode dev)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Mode Production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur Full-Stack démarré sur le port ${PORT}`);
  });
}

startServer();
