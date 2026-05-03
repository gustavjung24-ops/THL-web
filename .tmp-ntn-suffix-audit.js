const fs = require('fs');
const path = require('path');
const p = path.join(process.cwd(),'public/data/products/ntn_deep_groove_web_import.json');
const j = JSON.parse(fs.readFileSync(p,'utf8'));
const blocked = ['RS','2RS','RS2','2RS1'];
let totalProducts = 0;
let totalVariantCodes = 0;
let blockedHits = 0;
const examples = [];
for (const item of (j.products||[])) {
  totalProducts += 1;
  const base = String(item.product_code||'').toUpperCase();
  const variants = String(item.variants||'').split('|').map(function(v){ return v.trim().toUpperCase(); }).filter(Boolean);
  for (const v of variants) {
    if (v === base) continue;
    totalVariantCodes += 1;
    const suffix = v.startsWith(base) ? v.slice(base.length) : v;
    for (const b of blocked) {
      if (suffix.includes(b)) {
        blockedHits += 1;
        if (examples.length < 20) examples.push({base: item.product_code, variant: v, suffix});
        break;
      }
    }
  }
}
console.log(JSON.stringify({totalProducts,totalVariantCodes,blockedHits,examples},null,2));
