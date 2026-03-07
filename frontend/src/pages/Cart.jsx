import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShoppingBag, FiArrowLeft, FiTruck, FiCreditCard } from "react-icons/fi";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

const DELIVERY_FEE = 25;
const FREE_DELIVERY_THRESHOLD = 99;

const Cart = () => {
    const navigate = useNavigate();
    const { items, totalAmount, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    const deliveryFee = totalAmount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const grandTotal = totalAmount + deliveryFee;

    const handlePlaceOrder = async () => {
        if (items.length === 0) return;
        setLoading(true);
        try {
            const payload = {
                items: items.map((i) => ({
                    productId: i._id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    image: i.image,
                    unit: i.unit || "",
                })),
                totalAmount: grandTotal,
                paymentMethod: "COD",
            };
            const { data } = await createOrder(payload);
            clearCart();
            toast.success("🎉 Order placed successfully!", { duration: 3000 });
            navigate(`/order-confirmation/${data.data._id}`);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to place order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="cart-page" id="cart-page">
                <Navbar />
                <div className="cart-empty">
                    <span className="cart-empty__icon">🛒</span>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any drinks yet.</p>
                    <Link to="/" className="cart-empty__btn" id="continue-shopping-btn">
                        Browse Drinks
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page" id="cart-page">
            <Navbar />

            <div className="container cart-layout">
                {/* Cart Items */}
                <section aria-label="Cart items">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 16,
                        }}
                    >
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                            My Cart ({items.length} item{items.length !== 1 ? "s" : ""})
                        </h2>
                        <Link
                            to="/"
                            id="back-to-shop-btn"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                color: "#0c831f",
                                fontWeight: 500,
                                fontSize: "0.85rem",
                            }}
                        >
                            <FiArrowLeft size={14} /> Continue Shopping
                        </Link>
                    </div>

                    {items.map((item) => (
                        <CartItem key={item._id} item={item} />
                    ))}
                </section>

                {/* Summary */}
                <aside className="cart-summary" aria-label="Order summary">
                    <h3>Order Summary</h3>

                    <div className="cart-summary__row">
                        <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                        <span>₹{totalAmount.toFixed(0)}</span>
                    </div>
                    <div className="cart-summary__row">
                        <span>Delivery Fee</span>
                        {deliveryFee === 0 ? (
                            <span className="cart-summary__delivery">FREE ✈️</span>
                        ) : (
                            <span>₹{deliveryFee}</span>
                        )}
                    </div>
                    {totalAmount > 0 && totalAmount < FREE_DELIVERY_THRESHOLD && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, color: "#1f2937", marginBottom: 6 }}>
                                <span>₹{totalAmount.toFixed(0)} / ₹{FREE_DELIVERY_THRESHOLD.toFixed(0)}</span>
                                <span style={{ color: "#d97706" }}>Add ₹{(FREE_DELIVERY_THRESHOLD - totalAmount).toFixed(0)} to save ₹{DELIVERY_FEE}</span>
                            </div>
                            <div style={{ width: "100%", height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                                <div style={{ height: "100%", background: "#10b981", width: `${Math.min(100, (totalAmount / FREE_DELIVERY_THRESHOLD) * 100)}%`, transition: "width 0.3s ease" }}></div>
                            </div>
                        </div>
                    )}
                    <div className="cart-summary__row cart-summary__total">
                        <span>Total</span>
                        <span>₹{grandTotal.toFixed(0)}</span>
                    </div>

                    {/* Payment Method */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 0",
                            fontSize: "0.85rem",
                            color: "#6b7280",
                            borderTop: "1px solid #f3f4f6",
                            marginTop: 4,
                        }}
                    >
                        <FiCreditCard size={16} />
                        Payment: Cash on Delivery
                    </div>

                    <div style={{ position: "sticky", bottom: 20, zIndex: 10, background: "#fff", paddingTop: 8 }}>
                        <button
                            id="place-order-btn"
                            className="order-btn"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            aria-label="Place order"
                            style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: 14, background: "#0c831f", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: "1rem" }}
                        >
                            {loading ? (
                                "Placing Order..."
                            ) : (
                                <>
                                    <FiShoppingBag size={18} />
                                    Place Order · ₹{grandTotal.toFixed(0)}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Delivery guarantee */}
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: 12,
                            fontSize: "0.78rem",
                            color: "#9ca3af",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                        }}
                    >
                        <FiTruck size={12} />
                        Delivered in 10 minutes
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Cart;
