const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.jsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/text-\[#F5F9FF\]0/g, 'text-blue-300/70');
  content = content.replace(/text-\[#F5F9FF\]/g, 'text-blue-100');
  content = content.replace(/text-\[#B8C7DF\]/g, 'text-blue-300/50');
  content = content.replace(/text-\[#truncate/g, 'text-blue-300/70 truncate');
  content = content.replace(/text-\[#font-mono/g, 'text-blue-300/70 font-mono');
  content = content.replace(/text-\[#uppercase/g, 'text-blue-300/70 uppercase');
  content = content.replace(/text-\[#mt-1/g, 'text-blue-300/70 mt-1');
  content = content.replace(/text-\[#mb-6/g, 'text-blue-300/70 mb-6');
  content = content.replace(/text-\[#line-clamp-1/g, 'text-blue-300/70 line-clamp-1');
  content = content.replace(/text-\[#text-/g, 'text-blue-300/70 text-');
  content = content.replace(/text-\[#tracking-wider/g, 'text-blue-300/70 tracking-wider');
  content = content.replace(/text-\[#absolute/g, 'text-blue-300/70 absolute');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
