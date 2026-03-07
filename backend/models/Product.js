const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        originalPrice: {
            type: Number,
            default: null,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "Soft Drinks",
                "Juices",
                "Energy Drinks",
                "Water",
                "Tea & Coffee",
                "Dairy Drinks",
                "Sports Drinks",
                "Mocktails",
            ],
        },
        image: {
            type: String,
            default: "https://via.placeholder.com/300x300?text=Product",
        },
        description: {
            type: String,
            default: "",
        },
        stock: {
            type: Number,
            default: 50,
            min: 0,
        },
        unit: {
            type: String,
            default: "500ml",
        },
        brand: {
            type: String,
            default: "",
        },
        rating: {
            type: Number,
            default: 4.0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Text index for search
ProductSchema.index({ name: "text", description: "text", brand: "text" });

module.exports = mongoose.model("Product", ProductSchema);
