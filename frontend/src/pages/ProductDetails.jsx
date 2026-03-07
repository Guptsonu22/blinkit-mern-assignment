import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiStar, FiShoppingCart, FiArrowLeft, FiPackage, FiTruck } from "react-icons/fi";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { getProductById, getProducts } from "../services/api";
import { useCart } from "../context/CartContext";

const CATEGORY_EMOJIS = {
    "Soft Drinks": "🥤",
    "Juices": "🍊",
    "Energy Drinks": "⚡",
    "Water": "💧",
    "Tea & Coffee": "☕",
    "Dairy Drinks": "🥛",
    "Sports Drinks": "🏃",
    "Mocktails": "🍹",
};

const StarRating = ({ rating }) => {
    return (
        <div className="stars" aria-label={`Rating: ${rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <FiStar
                    key={n}
                    size={16}
                    className={n <= Math.round(rating) ? "star-filled" : "star-empty"}
                    fill={n <= Math.round(rating) ? "#f59e0b" : "none"}
                    stroke={n <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
                />
            ))}
        </div>
    );
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localQty, setLocalQty] = useState(1);

    const { addToCart, updateQuantity, isInCart, getQuantity } = useCart();
    const inCart = product ? isInCart(product._id) : false;
    const cartQty = product ? getQuantity(product._id) : 0;

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                window.scrollTo(0, 0);
                const { data } = await getProductById(id);
                setProduct(data.data);

                try {
                    const sim = await getProducts({ category: data.data.category, limit: 5 });
                    setSimilarProducts(sim.data.data.filter(p => p._id !== id).slice(0, 4));
                } catch (e) { }
            } catch {
                setError("Product not found or server error.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < localQty; i++) addToCart(product);
        toast.success(`${product.name} added to cart!`, {
            icon: "🛒",
            style: { fontWeight: "600" },
            duration: 2000,
            position: "bottom-center"
        });
    };

    const discount =
        product?.originalPrice && product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : null;

    if (loading) {
        return (
            <div className="detail-page" id="product-detail-page">
                <Navbar />
                <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
                    <div className="detail-grid">
                        <div style={{ background: "#e5e7eb", borderRadius: 16, aspectRatio: "1", position: "relative", overflow: "hidden" }} className="skeleton">
                            <div />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[80, 60, 40, 100, 60, 80].map((w, i) => (
                                <div key={i} className="skeleton" style={{ height: i === 3 ? 24 : 16, width: `${w}%`, borderRadius: 8 }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="detail-page" id="product-detail-page">
                <Navbar />
                <div className="container error-state" style={{ paddingTop: 48 }}>
                    <h2>Product Not Found</h2>
                    <p>{error || "This product doesn't exist."}</p>
                    <Link to="/" className="back-btn"><FiArrowLeft /> Back to Shop</Link>
                </div>
            </div>
        );
    }

    const isOutOfStock = product.stock === 0;

    return (
        <div className="detail-page" id="product-detail-page">
            <Navbar />

            <div className="container">
                {/* Breadcrumb */}
                <nav className="detail-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link> &nbsp;/&nbsp;
                    <Link to={`/?category=${product.category}`}>{product.category}</Link> &nbsp;/&nbsp;
                    <span style={{ color: "#1a1a1a", fontWeight: 500 }}>{product.name}</span>
                </nav>

                <div className="detail-grid">
                    {/* Left — Image */}
                    <div>
                        <div className="detail-img-wrap">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="detail-img"
                                onError={(e) => {
                                    e.target.src = "/images/drink-placeholder.png";
                                }}
                            />
                        </div>

                        <div style={{ marginTop: 24, paddingBottom: 24 }}>
                            <Link to={`/?category=${product.category === "All" ? "" : product.category}`}
                                style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#0c831f", fontWeight: 600 }}>
                                <FiArrowLeft /> Back to {product.category}
                            </Link>
                        </div>
                    </div>

                    {/* Right — Info */}
                    <div className="detail-info">
                        <span className="detail-brand">{product.brand || product.category}</span>
                        <h1 className="detail-name" id="product-name">{product.name}</h1>

                        {/* Rating */}
                        <div className="detail-rating">
                            <StarRating rating={product.rating} />
                            <span className="detail-review-count">
                                {product.rating?.toFixed(1)} ({product.reviewCount?.toLocaleString() || 0} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="detail-price-block">
                            <span className="detail-price" id="product-price">₹{product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="detail-original-price">₹{product.originalPrice}</span>
                            )}
                            {discount && (
                                <span className="detail-discount">{discount}% OFF</span>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="detail-tags">
                            <span className="detail-tag">{CATEGORY_EMOJIS[product.category]} {product.category}</span>
                            <span className="detail-tag">📦 {product.unit}</span>
                            {product.isFeatured && <span className="detail-tag">⭐ Featured</span>}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="detail-description-box" style={{ marginTop: 24, fontSize: "0.95rem", lineHeight: 1.6, borderBottom: "1px solid #f3f4f6", paddingBottom: 24 }}>
                                <p className="detail-description" style={{ marginBottom: 16 }}>{product.description}</p>

                                <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, color: "#1f2937" }}>Product Information</h4>
                                <ul style={{ listStyleType: "none", padding: 0, margin: 0, color: "#4b5563" }}>
                                    <li style={{ padding: "6px 0", borderBottom: "1px solid #f9fafb" }}><strong style={{ color: "#1f2937", display: "inline-block", width: 120 }}>Ingredients:</strong> Water, Sugar, Natural Flavours</li>
                                    <li style={{ padding: "6px 0", borderBottom: "1px solid #f9fafb" }}><strong style={{ color: "#1f2937", display: "inline-block", width: 120 }}>Brand:</strong> {product.brand || product.category}</li>
                                    <li style={{ padding: "6px 0" }}><strong style={{ color: "#1f2937", display: "inline-block", width: 120 }}>Shelf Life:</strong> 6 months</li>
                                </ul>
                            </div>
                        )}

                        {/* Stock */}
                        <div
                            className={`detail-stock ${isOutOfStock
                                ? "detail-stock--out"
                                : product.stock <= 10
                                    ? "detail-stock--low"
                                    : "detail-stock--ok"
                                }`}
                        >
                            <FiPackage />
                            {isOutOfStock
                                ? "Out of Stock"
                                : product.stock <= 10
                                    ? `Only ${product.stock} left!`
                                    : `In Stock (${product.stock} available)`}
                        </div>

                        {/* Quantity Selector (if not already in cart) */}
                        {!inCart && !isOutOfStock && (
                            <div className="detail-qty-row">
                                <span className="detail-qty-label">Quantity:</span>
                                <div className="detail-qty-control">
                                    <button
                                        id="detail-qty-dec"
                                        className="detail-qty-btn"
                                        onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <span className="detail-qty-value" aria-live="polite">{localQty}</span>
                                    <button
                                        id="detail-qty-inc"
                                        className="detail-qty-btn"
                                        onClick={() => setLocalQty((q) => Math.min(product.stock, q + 1))}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Cart in-line controls */}
                        {inCart && (
                            <div className="detail-qty-row">
                                <span className="detail-qty-label">In cart:</span>
                                <div className="detail-qty-control">
                                    <button
                                        id="detail-cart-dec"
                                        className="detail-qty-btn"
                                        onClick={() => updateQuantity(product._id, cartQty - 1)}
                                        aria-label="Decrease cart quantity"
                                    >
                                        −
                                    </button>
                                    <span className="detail-qty-value">{cartQty}</span>
                                    <button
                                        id="detail-cart-inc"
                                        className="detail-qty-btn"
                                        onClick={() => updateQuantity(product._id, cartQty + 1)}
                                        aria-label="Increase cart quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                <span style={{ fontSize: "0.85rem", color: "#0c831f", fontWeight: 500 }}>
                                    ✅ Added to cart
                                </span>
                            </div>
                        )}

                        {/* Add to Cart / Go to Cart */}
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {!inCart ? (
                                <button
                                    id="detail-add-to-cart-btn"
                                    className="detail-add-btn"
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    style={{ flex: 1 }}
                                >
                                    <FiShoppingCart size={18} />
                                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                                </button>
                            ) : (
                                <button
                                    id="detail-go-to-cart-btn"
                                    className="detail-add-btn"
                                    onClick={() => navigate("/cart")}
                                    style={{ flex: 1 }}
                                >
                                    <FiShoppingCart size={18} />
                                    Go to Cart
                                </button>
                            )}
                        </div>

                        {/* Delivery Info */}
                        <div
                            style={{
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                borderRadius: 12,
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                fontSize: "0.9rem",
                                color: "#166534",
                            }}
                        >
                            <FiTruck />
                            <strong>Free delivery</strong> in 10 minutes on orders above ₹99
                        </div>
                    </div>
                </div>

                {/* You may also like */}
                {similarProducts.length > 0 && (
                    <div style={{ marginTop: 64, marginBottom: 48 }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 20 }}>You may also like</h3>
                        <div className="products-grid">
                            {similarProducts.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
