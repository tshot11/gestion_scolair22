import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';

// Connexion SQLite
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'database.sqlite'),
  logging: false,
});

// Modèles
export const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ENUM('ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT', 'CAISSIER', 'PARENT', 'ELEVE'), 
    allowNull: false 
  },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
});

export const Student = sequelize.define('Student', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  matricule: { type: DataTypes.STRING, unique: true, allowNull: false },
  nom: { type: DataTypes.STRING, allowNull: false },
  classe: { type: DataTypes.STRING, allowNull: true },
  statut_inscription: { 
    type: DataTypes.ENUM('EN_ATTENTE', 'VALIDE', 'BLOQUE'), 
    defaultValue: 'EN_ATTENTE' 
  }
});

// Relation Élève -> Utilisateur (Compte de l'élève)
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Student.belongsTo(User, { foreignKey: 'userId' });

export const ParentStudent = sequelize.define('ParentStudent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }
});

// Relation Parent (User) <-> Élève (Student)
User.belongsToMany(Student, { through: ParentStudent, as: 'enfants', foreignKey: 'parentId' });
Student.belongsToMany(User, { through: ParentStudent, as: 'parents', foreignKey: 'studentId' });

export const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  montant: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  type_frais: { type: DataTypes.STRING, allowNull: false },
  reference: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  statut: { type: DataTypes.ENUM('VALIDE', 'ANNULE'), defaultValue: 'VALIDE' }
});

// Relation Paiement -> Élève et Caissier
Student.hasMany(Payment, { foreignKey: 'studentId' });
Payment.belongsTo(Student, { foreignKey: 'studentId' });
User.hasMany(Payment, { foreignKey: 'caissierId', as: 'encaissements' });
Payment.belongsTo(User, { foreignKey: 'caissierId', as: 'caissier' });

export const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  action: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.TEXT },
  ip_address: { type: DataTypes.STRING }
});

User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });
