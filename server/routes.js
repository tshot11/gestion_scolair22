import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Student, AuditLog, Payment } from './models.js';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-pour-app-scolaire';

// Middleware d'authentification
export const authenticate = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non autorisé' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// Middleware RBAC (Vérification des rôles)
export const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Accès refusé. Privilèges insuffisants.' });
  }
  next();
};

// --- AUTH ROUTES ---
router.post('/auth/login', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();
    const user = await User.findOne({ where: { email } });
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Identifiants invalides ou compte inactif' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, nom: user.nom }, JWT_SECRET, { expiresIn: '12h' });
    
    // Log connexion
    await AuditLog.create({ userId: user.id, action: 'LOGIN', details: 'Connexion réussie', ip_address: req.ip });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ token, user: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/auth/logout', async (req, res) => {
  if (req.user) {
    await AuditLog.create({ userId: req.user.id, action: 'LOGOUT', details: 'Déconnexion', ip_address: req.ip });
  }
  res.clearCookie('token');
  res.json({ success: true });
});

router.get('/auth/me', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'nom', 'email', 'role'] });
  res.json({ user });
});

// --- USER MANAGEMENT ROUTES (ADMIN ONLY) ---
router.get('/users', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'nom', 'email', 'role', 'is_active', 'createdAt'] });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

router.post('/users', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;
    
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Cet email est déjà utilisé' });

    // Hasher le mot de passe fourni par l'admin
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({ nom, email, password_hash, role });
    
    await AuditLog.create({ 
      userId: req.user.id, 
      action: 'CREATE_USER', 
      details: `Création du compte ${role} pour ${email}`,
      ip_address: req.ip 
    });

    res.json({ success: true, user: { id: newUser.id, nom: newUser.nom, email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
});


// Route pour modifier le mot de passe d'un compte (basé sur l'email)
router.put('/users/by-email', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: "Aucun compte de connexion trouvé pour cet email" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    await user.update({ password_hash });
    
    res.json({ success: true, message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la modification du compte" });
  }
});

router.delete('/users/:id', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    // Empêcher l'admin de se supprimer lui-même
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const email = user.email;
    const role = user.role;
    await user.destroy();

    await AuditLog.create({ 
      userId: req.user.id, 
      action: 'DELETE_USER', 
      details: `Suppression du compte ${role} (${email})`,
      ip_address: req.ip 
    });

    res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// --- API DUMMY (À étendre progressivement) ---
router.get('/dashboard/stats', authenticate, async (req, res) => {
  // Stats selon le rôle (Admin voit tout, Parent voit ses enfants, etc.)
  const totalEleves = await Student.count();
  res.json({ totalEleves, message: "Ceci est une route protégée de l'API Node.js" });
});


let ai = null;

router.post('/chat', async (req, res) => {
  try {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'La clé API Gemini n\'est pas configurée sur le serveur.' });
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
    const prompt = `
Tu es l'assistant virtuel intelligent de l'application de Gestion Scolaire RDC.
Ton rôle est d'aider les utilisateurs (parents, enseignants, administrateurs) à naviguer dans l'application et à trouver des informations.
Réponds de manière concise, polie et utile en français.

Voici quelques informations de contexte sur l'application actuelle :
${contextData || 'Aucune donnée spécifique fournie.'}

Question de l'utilisateur : ${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error('Erreur Chatbot:', err);
    res.status(500).json({ error: 'Erreur lors de la communication avec l\'assistant.' });
  }
});

export default router;
