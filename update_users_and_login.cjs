const fs = require('fs');

// 1. Fix UserManagementView
let userView = fs.readFileSync('src/components/views/UserManagementView.jsx', 'utf8');

// Add authorization header to all fetch requests
userView = userView.replace(/fetch\('\/api\/users'/g, 'fetch(\'/api/users\', {\n        headers: { "Authorization": `Bearer ${localStorage.getItem("auth_token")}` }\n      }');
userView = userView.replace(/fetch\(`\/api\/users\/\$\{id\}`,\s*\{\s*method:\s*'DELETE'/g, 'fetch(`/api/users/${id}`, { \n          method: "DELETE", \n          headers: { "Authorization": `Bearer ${localStorage.getItem("auth_token")}` }');
userView = userView.replace(/headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\}/g, 'headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("auth_token")}` }');

fs.writeFileSync('src/components/views/UserManagementView.jsx', userView);

// 2. Fix LoginView
let loginView = fs.readFileSync('src/components/views/LoginView.jsx', 'utf8');

// Add Eye, EyeOff to lucide-react import
loginView = loginView.replace(/import \{ Lock, Mail, ArrowLeft, School \} from 'lucide-react';/, "import { Lock, Mail, ArrowLeft, School, Eye, EyeOff } from 'lucide-react';");

// Add showPassword state
loginView = loginView.replace(/const \[error, setError\] = useState\(''\);/, "const [error, setError] = useState('');\n  const [showPassword, setShowPassword] = useState(false);");

// Update password input
const passwordInputOld = /<div className="relative">\s*<Lock className="absolute left-3 top-1\/2 -translate-y-1\/2 w-4 h-4 text-blue-300\/50" \/>\s*<input type="password" value=\{password\} onChange=\{e => setPassword\(e\.target\.value\)\} required className="w-full bg-\[\#0B1736\]\/60 border border-\[\#94C5FF\]\/15 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="••••••••" \/>\s*<\/div>/;

const passwordInputNew = `<div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[#0B1736]/60 border border-[#94C5FF]/15 rounded-xl py-3 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-300 focus:outline-none">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>`;

loginView = loginView.replace(passwordInputOld, passwordInputNew);

fs.writeFileSync('src/components/views/LoginView.jsx', loginView);
