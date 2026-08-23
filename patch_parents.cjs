const fs = require('fs');
const file = 'src/components/views/ParentsPortalView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const { data, getEleveDetail, setCurrentView, setSelectedEleveId, addMessage, showToast } = useApp();",
  "const { data, getEleveDetail, setCurrentView, setSelectedEleveId, addMessage, showToast, currentUser } = useApp();"
);

content = content.replace(
  "const [selectedChildId, setSelectedChildId] = useState(1);",
  "const [selectedChildId, setSelectedChildId] = useState(currentUser?.eleve_id || 1);\n  const [activeTab, setActiveTab] = useState('dossier');"
);

// We need to add "Espace Réunion/Forum Parents" and "Messagerie avec la direction". 
// Let's modify the return statement to include Tabs at the top.
