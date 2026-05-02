const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const stat = fs.statSync(dirFile);
    if (stat.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const dirs = [
  path.join(__dirname, 'app/dashboard'),
  path.join(__dirname, 'components/dashboard')
];

let files = [];
dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    files = files.concat(walkSync(dir));
  }
});

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace purple, pink, violet with blue
  content = content.replace(/purple/g, 'blue');
  content = content.replace(/pink/g, 'blue');
  content = content.replace(/violet/g, 'blue');

  // Replace some specific hardcoded gradients and backgrounds
  content = content.replace(/bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950/g, 'bg-background text-foreground');
  content = content.replace(/bg-slate-900\/40/g, 'bg-card text-card-foreground shadow-sm');
  content = content.replace(/bg-slate-900\/80/g, 'bg-card text-card-foreground shadow-sm');
  content = content.replace(/bg-slate-900/g, 'bg-card text-card-foreground');
  content = content.replace(/bg-slate-950\/50/g, 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60');
  content = content.replace(/bg-slate-950/g, 'bg-background');

  // Borders
  content = content.replace(/border-blue-500\/20/g, 'border-border');
  content = content.replace(/border-blue-500\/30/g, 'border-border');
  content = content.replace(/border-slate-700\/50/g, 'border-border');
  content = content.replace(/border-slate-700/g, 'border-border');
  content = content.replace(/border-slate-800/g, 'border-border');

  // Text colors
  content = content.replace(/text-white/g, 'text-foreground');
  content = content.replace(/text-slate-400/g, 'text-muted-foreground');
  content = content.replace(/text-slate-300/g, 'text-muted-foreground');
  content = content.replace(/text-slate-500/g, 'text-muted-foreground');
  
  // Note: Emerald and green are usually used for success states or specific UI elements (like trust scores). 
  // Let's replace emerald with blue for non-success items or let's keep them as green/emerald if they indicate a score.
  // Actually, the user said "black and blue color dark and light mode", so let's convert emerald to blue for a monochromatic look.
  content = content.replace(/emerald/g, 'blue');
  content = content.replace(/teal/g, 'blue');
  content = content.replace(/green/g, 'blue');
  
  // Standardize hover states
  content = content.replace(/hover:bg-slate-800\/30/g, 'hover:bg-accent hover:text-accent-foreground');
  content = content.replace(/hover:bg-slate-800/g, 'hover:bg-accent hover:text-accent-foreground');
  content = content.replace(/hover:bg-slate-700/g, 'hover:bg-accent hover:text-accent-foreground');
  content = content.replace(/bg-slate-800/g, 'bg-muted');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Replaced colors in ' + files.length + ' files');
