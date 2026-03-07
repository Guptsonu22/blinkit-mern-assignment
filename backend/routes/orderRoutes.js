const express = require("express");
const router = express.Router();
const { createOrder, getOrderById, getAllOrders } = require("../controllers/orderController");

// GET /api/orders
router.get("/", getAllOrders);

// GET /api/orders/:id
router.get("/:id", getOrderById);

// POST /api/orders
router.post("/", createOrder);

module.exports = router;
