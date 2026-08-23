const fs = require('fs');
const file = 'server/routes.js';
let content = fs.readFileSync(file, 'utf8');

const putRoute = `
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
`;

if (!content.includes('/users/by-email')) {
  content = content.replace("router.delete('/users/:id'", putRoute + "\nrouter.delete('/users/:id'");
  fs.writeFileSync(file, content);
}
