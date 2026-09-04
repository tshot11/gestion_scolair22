const fs = require('fs');
let content = fs.readFileSync('server/routes.js', 'utf8');

const oldPostData = `router.post('/data/:collection', authenticate, async (req, res) => {
  try {
    const model = getModel(req.params.collection);`;

const newPostData = `router.post('/data/:collection', authenticate, async (req, res) => {
  try {
    const coll = req.params.collection;
    // ROLE ENFORCEMENT
    if (['cours', 'classes', 'options', 'salles', 'enseignants'].includes(coll) && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Action non autorisée. Seul l'administrateur peut modifier la structure académique." });
    }
    const model = getModel(coll);`;

content = content.replace(oldPostData, newPostData);

const oldPutData = `router.put('/data/:collection/:id', authenticate, async (req, res) => {
  try {
    const model = getModel(req.params.collection);`;

const newPutData = `router.put('/data/:collection/:id', authenticate, async (req, res) => {
  try {
    const coll = req.params.collection;
    if (['cours', 'classes', 'options', 'salles', 'enseignants'].includes(coll) && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Action non autorisée. Seul l'administrateur peut modifier la structure académique." });
    }
    const model = getModel(coll);`;

content = content.replace(oldPutData, newPutData);

const oldDeleteData = `router.delete('/data/:collection/:id', authenticate, async (req, res) => {
  try {
    const model = getModel(req.params.collection);`;

const newDeleteData = `router.delete('/data/:collection/:id', authenticate, async (req, res) => {
  try {
    const coll = req.params.collection;
    if (['cours', 'classes', 'options', 'salles', 'enseignants'].includes(coll) && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Action non autorisée. Seul l'administrateur peut modifier la structure académique." });
    }
    const model = getModel(coll);`;

content = content.replace(oldDeleteData, newDeleteData);

fs.writeFileSync('server/routes.js', content);
console.log("Routes patched with role enforcement");
