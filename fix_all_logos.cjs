const fs = require('fs');

const fixLogo = (filePath, oldStr, newStr) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(filePath, content, 'utf8');
};

// Layouts
fixLogo('./src/components/layout/DesktopSidebar.jsx', 
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover bg-white shadow-lg shrink-0 border border-[#94C5FF]/15" />',
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 object-contain shrink-0" />'
);

fixLogo('./src/components/layout/MobileDrawerMenu.jsx', 
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover bg-white shadow-md shrink-0 border border-[#94C5FF]/15" />',
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 object-contain shrink-0" />'
);

fixLogo('./src/components/layout/MobileHeader.jsx', 
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-8 h-8 rounded-full object-cover bg-white shadow-sm shrink-0 border border-[#94C5FF]/15" />',
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-8 h-8 object-contain shrink-0" />'
);

// Landing page
fixLogo('./src/components/views/LandingPageView.jsx', 
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-9 h-9 rounded-[10px] object-cover bg-white" />',
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-9 h-9 object-contain" />'
);

fixLogo('./src/components/views/LandingPageView.jsx', 
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 rounded-[10px] object-cover bg-white" />',
  '<img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 object-contain" />'
);

