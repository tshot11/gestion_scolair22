import bcrypt from 'bcryptjs';
import { sequelize, User, Student, AuditLog } from './models.js';

export async function initDB() {
  // Check if DB is already seeded by checking users count
  await sequelize.sync({ alter: true }); 
  
  const count = await User.count();
  if (count > 0) {
    console.log("Base de données déjà initialisée. Seeding ignoré.");
    return;
  }

  console.log("Base de données vide. Seeding de l'administrateur uniquement...");
  
  const salt = await bcrypt.genSalt(10);
  // Default password that the user will change or use to login
  const password_hash = await bcrypt.hash('admin123', salt); 

  // Création du compte Admin principal selon le souhait de l'utilisateur
  await User.create({ 
    nom: "Administrateur Principal", 
    email: "johntshottshot12@gmail.com", 
    password_hash, 
    role: "ADMIN" 
  });
  
  console.log("Seeding terminé. L'application est maintenant vierge de données simulées.");
  console.log("Utilisez l'email 'johntshottshot12@gmail.com' et le mot de passe 'admin123' pour vous connecter et créer les autres comptes.");
}
