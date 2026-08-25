#!/bin/bash
# Find all jsx files in src/components (excluding LandingPageView to avoid touching what we just perfectly tuned, although we did patch LoginView we can patch others)
find src/components -type f -name "*.jsx" ! -name "LandingPageView.jsx" ! -name "LoginView.jsx" -print0 | while IFS= read -r -d '' file; do
  # Main background colors
  sed -i 's/bg-slate-950/bg-[#0B132B]/g' "$file"
  sed -i 's/bg-slate-900\/50/bg-[#1C2541]\/40/g' "$file"
  sed -i 's/bg-slate-900/bg-[#1C2541]\/60/g' "$file"
  sed -i 's/bg-slate-800\/50/bg-blue-500\/10/g' "$file"
  sed -i 's/bg-slate-800\/80/bg-[#1C2541]\/80/g' "$file"
  sed -i 's/bg-slate-800/bg-[#1C2541]/g' "$file"
  
  # Borders
  sed -i 's/border-slate-800\/50/border-blue-500\/20/g' "$file"
  sed -i 's/border-slate-800/border-blue-500\/20/g' "$file"
  sed -i 's/border-slate-700/border-blue-400\/30/g' "$file"
  sed -i 's/border-slate-600/border-blue-400\/40/g' "$file"

  # Hover states
  sed -i 's/hover:bg-slate-800/hover:bg-blue-500\/10/g' "$file"
  sed -i 's/hover:bg-slate-700/hover:bg-blue-500\/20/g' "$file"
  sed -i 's/hover:border-slate-700/hover:border-blue-400\/40/g' "$file"

  # Text colors
  sed -i 's/text-slate-400/text-blue-200\/70/g' "$file"
  sed -i 's/text-slate-300/text-blue-100\/90/g' "$file"
  sed -i 's/text-slate-500/text-blue-200\/50/g' "$file"
  
  # Divide lines
  sed -i 's/divide-slate-800/divide-blue-500\/20/g' "$file"
  sed -i 's/divide-slate-700/divide-blue-500\/30/g' "$file"
  
  # Focus rings
  sed -i 's/focus:border-slate-600/focus:border-blue-400/g' "$file"
  sed -i 's/focus:ring-slate-600/focus:ring-blue-400\/50/g' "$file"

  # Inputs & placeholders
  sed -i 's/placeholder-slate-500/placeholder-blue-200\/40/g' "$file"
done
echo "Global theme patch applied."
