const Order = require("../models/Order");

// @desc   Create a new order
// @route  POST /api/orders
// @access Public
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items in order" });
        }

        const order = await Order.create({
            items,
            totalAmount,
            deliveryAddress: deliveryAddress || "Default Address",
            paymentMethod: paymentMethod || "COD",
            status: "confirmed",
        });

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc   Get order by ID
// @route  GET /api/orders/:id
// @access Public
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).lean();
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Get all orders
// @route  GET /api/orders
// @access Public
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: orders, count: orders.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createOrder, getOrderById, getAllOrders };
