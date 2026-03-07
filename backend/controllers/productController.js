const Product = require("../models/Product");

// @desc   Get all products with filtering, search, pagination
// @route  GET /api/products
// @access Public
const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            search,
            sort = "createdAt",
            order = "desc",
            minPrice,
            maxPrice,
            featured,
        } = req.query;

        // Build filter object
        const filter = {};

        if (category && category !== "All") {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ];
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (featured === "true") {
            filter.isFeatured = true;
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(48, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const sortOrder = order === "asc" ? 1 : -1;
        const sortObj = { [sort]: sortOrder };

        const [products, total] = await Promise.all([
            Product.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
            Product.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1,
            },
        });
    } catch (error) {
        console.error("getProducts error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc   Get single product by ID
// @route  GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc   Create a product
// @route  POST /api/products
// @access Public (Admin in production)
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc   Update a product
// @route  PUT /api/products/:id
// @access Public (Admin in production)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Public (Admin in production)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Get all unique categories
// @route  GET /api/products/categories
// @access Public
const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
};
