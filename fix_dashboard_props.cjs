const fs = require('fs');
let code = fs.readFileSync('./src/components/views/DashboardView.jsx', 'utf8');

const targetProps = `export function DashboardView({
  data,
  setCurrentView,
  setSelectedEleveId,
  incidentsActifs,
  recentPayments,
}) {
  const elevesCount = (data?.eleves || []).length;
  const classesCount = (data?.classes || []).length;
  const activeAlerts = incidentsActifs.length;
  const recentEleves = (data?.eleves || []).slice(-4).reverse();`;

const replacementProps = `import { useApp } from "../../context/AppContext";

export function DashboardView() {
  const { setCurrentView, setSelectedEleveId, data } = useApp();

  const elevesCount = (data?.eleves || []).length;
  const classesCount = (data?.classes || []).length;
  const recentEleves = (data?.eleves || []).slice(-4).reverse();
  const recentPayments = (data?.paiements || []).slice(-4).reverse();
  const incidentsActifs = (data?.incidents || []).filter((i) => !i.date_cloture);
  const activeAlerts = incidentsActifs.length;`;

code = code.replace(
  /export function DashboardView\(\{[\s\S]*?\}\) \{[\s\S]*?const recentEleves = \(data\?\.eleves \|\| \[\]\)\.slice\(-4\)\.reverse\(\);/,
  replacementProps
);

fs.writeFileSync('./src/components/views/DashboardView.jsx', code, 'utf8');
