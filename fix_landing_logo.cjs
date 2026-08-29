const fs = require('fs');
let content = fs.readFileSync('./src/components/views/LandingPageView.jsx', 'utf8');

const defaultLogoHeader = `
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white"
            style={{
              background: "linear-gradient(135deg,#4EA3FF,#2563EB)",
              boxShadow: "0 8px 25px rgba(78,163,255,0.20)",
            }}
          >
            <School className="w-5 h-5" />
          </div>`;

const newLogoHeader = `
          {data?.ecoleConfig?.logo ? (
            <img src={data.ecoleConfig.logo} alt="Logo" className="w-9 h-9 rounded-[10px] object-cover bg-white" />
          ) : (
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg,#4EA3FF,#2563EB)",
                boxShadow: "0 8px 25px rgba(78,163,255,0.20)",
              }}
            >
              <School className="w-5 h-5" />
            </div>
          )}`;
          
const defaultLogoFooter = `
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white"
                style={{
                  background: "linear-gradient(135deg,#4EA3FF,#2563EB)",
                }}
              >
                <School className="w-5 h-5" />
              </div>`;
              
const newLogoFooter = `
              {data?.ecoleConfig?.logo ? (
                <img src={data.ecoleConfig.logo} alt="Logo" className="w-10 h-10 rounded-[10px] object-cover bg-white" />
              ) : (
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white"
                  style={{
                    background: "linear-gradient(135deg,#4EA3FF,#2563EB)",
                  }}
                >
                  <School className="w-5 h-5" />
                </div>
              )}`;

content = content.replace(defaultLogoHeader, newLogoHeader);
content = content.replace(defaultLogoFooter, newLogoFooter);

fs.writeFileSync('./src/components/views/LandingPageView.jsx', content, 'utf8');
