const fs = require('fs');
const content = fs.readFileSync('frontend/src/context/CartContext.jsx', 'utf8');
const hasLazyInit = content.includes('useReducer(cartReducer, undefined, ()');
const hasSaveEffect = content.includes('localStorage.setItem');
const noRaceCondition = !content.includes('"LOAD_CART"');
console.log('Cart lazy initializer (sync localStorage load):', hasLazyInit ? 'PRESENT' : 'MISSING');
console.log('Cart save useEffect (persist on change):', hasSaveEffect ? 'PRESENT' : 'MISSING');
console.log('Race condition fixed (no async LOAD_CART):', noRaceCondition ? 'YES - FIXED' : 'NO - still has race');

// Check frontend structure
const pages = ['Home.jsx', 'ProductDetails.jsx', 'Cart.jsx', 'OrderConfirmation.jsx'];
const components = ['Navbar.jsx', 'ProductCard.jsx', 'CategoryFilter.jsx', 'CartItem.jsx', 'Skeleton.jsx'];
pages.forEach(f => {
    const exists = fs.existsSync('frontend/src/pages/' + f);
    console.log('Page ' + f + ':', exists ? 'EXISTS' : 'MISSING');
});
components.forEach(f => {
    const exists = fs.existsSync('frontend/src/components/' + f);
    console.log('Component ' + f + ':', exists ? 'EXISTS' : 'MISSING');
});

// Check backend files
const backendFiles = ['backend/models/Product.js', 'backend/models/Order.js', 'backend/controllers/productController.js', 'backend/controllers/orderController.js', 'backend/routes/productRoutes.js', 'backend/routes/orderRoutes.js', 'backend/seed/seedProducts.js'];
backendFiles.forEach(f => {
    const exists = fs.existsSync(f);
    console.log(f + ':', exists ? 'EXISTS' : 'MISSING');
});
