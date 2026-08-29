const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/views/**/*.jsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Clean up corrupted tailwind classes
  content = content.replace(/bg-\[#12305A\]\/45 A\]\/45 bg-\[#12305A\]\/45 backdrop-blur-md\/\d+ backdrop-blur-md/g, 'bg-[#12305A]/45 backdrop-blur-md');
  content = content.replace(/bg-\[#12305A\]\/45 A\]\/45 A\]\/45 bg-\[#12305A\]\/45 backdrop-blur-md\/\d+ backdrop-blur-md/g, 'bg-[#12305A]/45 backdrop-blur-md');
  content = content.replace(/bg-white A\]\/45 A\]\/45 bg-\[#12305A\]\/45 backdrop-blur-md\/\d+ backdrop-blur-md/g, 'bg-[#12305A]/45 backdrop-blur-md');
  content = content.replace(/bg-white backdrop-blur-md/g, 'bg-[#12305A]/45 backdrop-blur-md');
  content = content.replace(/bg-\[#12305A\]\/45 A\]\/45 bg-\[#12305A\]\/45 backdrop-blur-md\/40/g, 'bg-[#12305A]/45 backdrop-blur-md');
  content = content.replace(/border-\[#94C5FF\]\/15 C5FF\]\/15/g, 'border-[#94C5FF]/15');
  content = content.replace(/text-\[#hover/g, 'text-blue-300 hover');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
