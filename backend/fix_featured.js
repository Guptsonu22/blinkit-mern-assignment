const fs = require('fs');
let content = fs.readFileSync('seed/seedProducts.js', 'utf8');

// First wipe all isFeatured to false
content = content.replace(/isFeatured:\s*true/g, 'isFeatured: false');

// Then specifically target Red Bull Original, Coca-Cola Classic, Frooti Mango, Tropicana Orange
content = content.replace(/(name:\s*\"Red Bull Original\"[\s\S]*?)isFeatured:\s*false/g, '$1isFeatured: true');
content = content.replace(/(name:\s*\"Coca-Cola Classic\"[\s\S]*?)isFeatured:\s*false/g, '$1isFeatured: true');
content = content.replace(/(name:\s*\"Frooti Mango\"[\s\S]*?)isFeatured:\s*false/g, '$1isFeatured: true');
content = content.replace(/(name:\s*\"Tropicana Orange\"[\s\S]*?)isFeatured:\s*false/g, '$1isFeatured: true');

fs.writeFileSync('seed/seedProducts.js', content);
