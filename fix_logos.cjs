const fs = require('fs');

const files = [
  './src/components/layout/DesktopSidebar.jsx',
  './src/components/layout/MobileDrawerMenu.jsx',
  './src/components/layout/MobileHeader.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (file.includes('DesktopSidebar')) {
    content = content.replace(
      '<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-lg shrink-0 border border-[#94C5FF]/15"><School className="w-5 h-5" /></div>',
      `{data?.ecoleConfig?.logo ? (
        <img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover bg-white shadow-lg shrink-0 border border-[#94C5FF]/15" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-lg shrink-0 border border-[#94C5FF]/15"><School className="w-5 h-5" /></div>
      )}`
    );
  }

  if (file.includes('MobileDrawerMenu')) {
    content = content.replace(
      '<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-md shrink-0 border border-[#94C5FF]/15"><School className="w-5 h-5" /></div>',
      `{data?.ecoleConfig?.logo ? (
        <img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover bg-white shadow-md shrink-0 border border-[#94C5FF]/15" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-md shrink-0 border border-[#94C5FF]/15"><School className="w-5 h-5" /></div>
      )}`
    );
  }

  if (file.includes('MobileHeader')) {
    content = content.replace(
      '<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 shrink-0 shadow-sm border border-[#94C5FF]/15"><School className="w-4 h-4" /></div>',
      `{data?.ecoleConfig?.logo ? (
        <img src={data.ecoleConfig.logo} alt="Logo" className="w-8 h-8 rounded-full object-cover bg-white shadow-sm shrink-0 border border-[#94C5FF]/15" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 shrink-0 shadow-sm border border-[#94C5FF]/15"><School className="w-4 h-4" /></div>
      )}`
    );
  }

  fs.writeFileSync(file, content, 'utf8');
});
