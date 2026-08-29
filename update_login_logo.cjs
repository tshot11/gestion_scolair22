const fs = require('fs');
let content = fs.readFileSync('./src/components/views/LoginView.jsx', 'utf8');

content = content.replace(
  'const { login, setCurrentView } = useApp();',
  'const { login, setCurrentView, data } = useApp();'
);

content = content.replace(
  '<div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3 border border-blue-400/30">\n            <School className="w-8 h-8 text-white" />\n          </div>',
  `{data?.ecoleConfig?.logo ? (
            <div className="w-20 h-20 mb-3 flex items-center justify-center">
              <img src={data.ecoleConfig.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3 border border-blue-400/30">
              <School className="w-8 h-8 text-white" />
            </div>
          )}`
);

fs.writeFileSync('./src/components/views/LoginView.jsx', content, 'utf8');
