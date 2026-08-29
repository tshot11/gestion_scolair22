const fs = require('fs');

function addLogoToBulletin() {
  let content = fs.readFileSync('./src/components/views/BulletinView.jsx', 'utf8');
  
  const target = `<div className="text-center mb-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">
            {(data?.ecoleConfig || {}).nom}
          </h2>`;
          
  const replaceWith = `<div className="text-center mb-6 flex flex-col items-center">
          {data?.ecoleConfig?.logo && (
            <img src={data?.ecoleConfig?.logo} alt="Logo" className="w-16 h-16 object-contain mb-2 print:opacity-100" />
          )}
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">
            {(data?.ecoleConfig || {}).nom}
          </h2>`;
          
  content = content.replace(target, replaceWith);
  fs.writeFileSync('./src/components/views/BulletinView.jsx', content, 'utf8');
}

function addLogoToReceipt() {
  if (!fs.existsSync('./src/components/views/ReceiptView.jsx')) return;
  let content = fs.readFileSync('./src/components/views/ReceiptView.jsx', 'utf8');
  
  const target = `<div className="text-center mb-6 border-b border-dashed border-slate-300 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">
              {data?.ecoleConfig?.nom || "Nom de l'école"}
            </h2>`;
            
  const replaceWith = `<div className="text-center mb-6 border-b border-dashed border-slate-300 pb-4 flex flex-col items-center">
            {data?.ecoleConfig?.logo && (
              <img src={data?.ecoleConfig?.logo} alt="Logo" className="w-14 h-14 object-contain mb-2 print:opacity-100" />
            )}
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">
              {data?.ecoleConfig?.nom || "Nom de l'école"}
            </h2>`;
            
  content = content.replace(target, replaceWith);
  fs.writeFileSync('./src/components/views/ReceiptView.jsx', content, 'utf8');
}

addLogoToBulletin();
addLogoToReceipt();

