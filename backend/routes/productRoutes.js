const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
} = require("../controllers/productController");

// GET /api/products/categories  — must be before /:id
router.get("/categories", getCategories);

// GET /api/products
// Query params: page, limit, category, search, sort, order, minPrice, maxPrice, featured
router.get("/", getProducts);

// GET /api/products/:id
router.get("/:id", getProductById);

// POST /api/products
router.post("/", createProduct);

// PUT /api/products/:id
router.put("/:id", updateProduct);

// DELETE /api/products/:id
router.delete("/:id", deleteProduct);

module.exports = router;
