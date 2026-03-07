const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
    unit: { type: String, default: "" },
});

const OrderSchema = new mongoose.Schema(
    {
        items: {
            type: [OrderItemSchema],
            required: true,
            validate: {
                validator: (arr) => arr.length > 0,
                message: "Order must have at least one item",
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: [0, "Total amount cannot be negative"],
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "delivered", "cancelled"],
            default: "confirmed",
        },
        deliveryAddress: {
            type: String,
            default: "Default Address",
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "Online"],
            default: "COD",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
