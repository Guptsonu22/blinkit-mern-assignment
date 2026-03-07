import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiCheckCircle, FiHome, FiShoppingBag, FiTruck, FiClock } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { getOrderById } from "../services/api";

const OrderConfirmation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await getOrderById(id);
                setOrder(data.data);
            } catch {
                setError("Order not found.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    // Delivery countdown
    useEffect(() => {
        if (!order) return;
        const timer = setInterval(() => {
            setTimeLeft((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [order]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60)
            .toString()
            .padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    if (loading) {
        return (
            <div className="confirm-page" id="order-confirmation-page">
                <Navbar />
                <div className="confirm-card">
                    <div className="skeleton" style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px" }} />
                    <div className="skeleton" style={{ height: 24, width: "60%", margin: "0 auto 12px", borderRadius: 8 }} />
                    <div className="skeleton" style={{ height: 16, width: "80%", margin: "0 auto", borderRadius: 8 }} />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="confirm-page" id="order-confirmation-page">
                <Navbar />
                <div className="confirm-card">
                    <h2>Order Not Found</h2>
                    <p>{error}</p>
                    <Link to="/" className="confirm-btn confirm-btn--primary" style={{ marginTop: 16, display: "inline-block" }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="confirm-page" id="order-confirmation-page">
            <Navbar />

            <div className="confirm-card">
                {/* Success Icon */}
                <div className="confirm-icon">
                    <FiCheckCircle size={40} color="#0c831f" />
                </div>

                <h1>Order Placed! 🎉</h1>
                <p className="subtitle">
                    Your order has been confirmed and is being prepared for delivery.
                </p>

                {/* Order ID */}
                <div className="confirm-order-id">
                    <div className="label">Order ID</div>
                    <div className="value" id="order-id">{order._id}</div>
                </div>

                {/* Countdown */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                        border: "1px solid #bbf7d0",
                        borderRadius: 12,
                        padding: "16px 20px",
                        marginBottom: 20,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: "0.8rem",
                            color: "#065f46",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                        }}
                    >
                        <FiTruck size={14} /> Estimated Delivery
                    </div>
                    <div
                        style={{
                            fontSize: "2.2rem",
                            fontWeight: 900,
                            color: "#0c831f",
                            fontFamily: "monospace",
                            letterSpacing: "0.05em",
                        }}
                    >
                        {timeLeft > 0 ? formatTime(timeLeft) : "Arriving!"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 4 }}>
                        <FiClock size={11} style={{ verticalAlign: "middle" }} /> minutes remaining
                    </div>
                </div>

                {/* Items */}
                <div className="confirm-items">
                    <h3>Items Ordered</h3>
                    {order.items.map((item, idx) => (
                        <div key={idx} className="confirm-item">
                            <span>
                                {item.name}
                                {item.unit ? ` (${item.unit})` : ""}
                            </span>
                            <span>
                                <span className="qty">×{item.quantity}</span> &nbsp;₹{(item.price * item.quantity).toFixed(0)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="confirm-total" id="order-total">
                    <span>Total Paid</span>
                    <span>₹{order.totalAmount.toFixed(0)}</span>
                </div>

                {/* Status */}
                <div className="confirm-delivery">
                    <FiTruck size={18} />
                    <div>
                        <div style={{ fontWeight: 600 }}>Order Status: {order.status.toUpperCase()}</div>
                        <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Payment: {order.paymentMethod}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="confirm-actions">
                    <Link to="/" id="continue-shopping-link" className="confirm-btn confirm-btn--primary">
                        <FiHome size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
                        Continue Shopping
                    </Link>
                    <button
                        id="track-order-btn"
                        className="confirm-btn confirm-btn--outline"
                        onClick={() => navigate("/")}
                    >
                        <FiShoppingBag size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
                        Track Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
