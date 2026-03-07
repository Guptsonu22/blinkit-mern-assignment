require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            process.env.FRONTEND_URL,
        ].filter(Boolean),
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 Blinkit API is running!",
        version: "1.0.0",
        endpoints: {
            products: "/api/products",
            orders: "/api/orders",
        },
    });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
