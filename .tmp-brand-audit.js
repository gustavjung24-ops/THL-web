const fs = require('fs');
const path = require('path');
const root = process.cwd();
const whitelist = JSON.parse(fs.readFileSync(path.join(root,'src/data/catalog/brand-whitelist.json'),'utf8')).brand_whitelist || [];
const logosTs = fs.readFileSync(path.join(root,'src/data/brand-logos.ts'),'utf8');
const logoNames = Array.from(logosTs.matchAll(/name:\s*"([^"]+)"/g)).map(function(m){ return m[1]; });
const files = fs.readdirSync(path.join(root,'public/data/products')).filter(function(f){ return f.endsWith('_web_import.json'); });
const dataBrands = [];
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(path.join(root,'public/data/products',f),'utf8'));
  const b = (j.meta && j.meta.brand) || (j.metadata && j.metadata.brand) || (j.products && j.products[0] && j.products[0].brand) || '';
  if (String(b).trim()) dataBrands.push(String(b).trim());
}
function uniq(arr){ return Array.from(new Set(arr)); }
const db = uniq(dataBrands);
const wl = uniq(whitelist);
const lg = uniq(logoNames);
function matchBrand(a,b){
  const au = String(a).toUpperCase();
  const bu = String(b).toUpperCase();
  return au === bu || au.includes(bu) || bu.includes(au);
}
const missingInWhitelist = db.filter(function(b){ return !wl.some(function(w){ return matchBrand(b,w); }); });
const missingLogo = db.filter(function(b){ return !lg.some(function(l){ return matchBrand(b,l); }); });
const logoNoData = lg.filter(function(l){ return !db.some(function(b){ return matchBrand(l,b); }); });
console.log(JSON.stringify({dataBrands:db, whitelist:wl, logos:lg, missingInWhitelist, missingLogo, logoNoData}, null, 2));
