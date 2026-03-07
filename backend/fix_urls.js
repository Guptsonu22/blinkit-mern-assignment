const fs = require('fs');
const https = require('https');

const getImages = (query, count) => new Promise((resolve) => {
    https.get({
        hostname: 'unsplash.com',
        path: '/napi/search/photos?query=' + query + '&per_page=30',
        headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => {
            try {
                const urls = JSON.parse(data).results.map(r => r.urls.raw.split('?')[0] + '?w=400&q=80');
                resolve(urls.slice(0, count));
            } catch (e) { resolve([]); }
        });
    });
});

(async () => {
    // Queries
    const sodas = await getImages('soda+bottle', 15);
    const juices = await getImages('fruit+juice', 10);
    const waters = await getImages('bottled+water', 10);
    const coffees = await getImages('coffee+drink', 10);
    const milks = await getImages('milk+drink', 10);
    const sports = await getImages('sports+drink', 10);
    const mocktails = await getImages('cocktail', 10);

    // Fallback queue so we never duplicate
    const allUnique = [...sodas, ...juices, ...waters, ...coffees, ...milks, ...sports, ...mocktails];
    let fallbacks = [...allUnique];

    let content = fs.readFileSync('seed/seedProducts.js', 'utf8');

    let currentCategory = '';
    content = content.replace(/(category:\s*\"([^\"]+)\")|(image:\s*\"([^\"]+)\")/g, (match, p1, catGroup, p3, imgGroup) => {
        if (catGroup) {
            currentCategory = catGroup;
            return match; // return category unchanged
        }
        if (imgGroup) {
            let selectedImg = fallbacks.pop();

            // Map specifically for better results
            if (currentCategory === 'Soft Drinks' && sodas.length) selectedImg = sodas.pop();
            else if (currentCategory === 'Energy Drinks' && sodas.length) selectedImg = sodas.pop();
            else if (currentCategory === 'Juices' && juices.length) selectedImg = juices.pop();
            else if (currentCategory === 'Water' && waters.length) selectedImg = waters.pop();
            else if (currentCategory === 'Tea & Coffee' && coffees.length) selectedImg = coffees.pop();
            else if (currentCategory === 'Dairy Drinks' && milks.length) selectedImg = milks.pop();
            else if (currentCategory === 'Sports Drinks' && sports.length) selectedImg = sports.pop();
            else if (currentCategory === 'Mocktails' && mocktails.length) selectedImg = mocktails.pop();

            if (!selectedImg) selectedImg = 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80';

            return 'image: \"' + selectedImg + '\"';
        }
        return match;
    });

    fs.writeFileSync('seed/seedProducts.js', content);
    console.log('Fixed URLs and saved.');
})();
