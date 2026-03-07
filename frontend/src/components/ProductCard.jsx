import { useNavigate } from "react-router-dom";
import { FiStar, FiPackage } from "react-icons/fi";
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

const getDiscount = (price, original) => {
    if (!original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart, removeFromCart, updateQuantity, isInCart, getQuantity } = useCart();
    const inCart = isInCart(product._id);
    const qty = getQuantity(product._id);
    const discount = getDiscount(product.price, product.originalPrice);
    const isLowStock = product.stock > 0 && product.stock <= 10;
    const isOutOfStock = product.stock === 0;

    const handleAdd = (e) => {
        e.stopPropagation();
        addToCart(product);
    };
    const handleIncrease = (e) => {
        e.stopPropagation();
        updateQuantity(product._id, qty + 1);
    };
    const handleDecrease = (e) => {
        e.stopPropagation();
        if (qty === 1) removeFromCart(product._id);
        else updateQuantity(product._id, qty - 1);
    };

    return (
        <article
            className="product-card"
            onClick={() => navigate(`/product/${product._id}`)}
            id={`product-card-${product._id}`}
            aria-label={`${product.name}, ₹${product.price}`}
        >
            {/* Image */}
            <div className="product-card__img-wrap">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-card__img"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = "/images/drink-placeholder.png";
                    }}
                />
                {discount && <span className="product-card__discount-badge">{discount}% OFF</span>}
                {product.isFeatured && <span className="product-card__featured-badge">⭐ TOP</span>}
                {isLowStock && !isOutOfStock && (
                    <div className="product-card__stock-low">Only {product.stock} left!</div>
                )}
                {isOutOfStock && (
                    <div className="product-card__stock-low">Out of Stock</div>
                )}
            </div>

            {/* Body */}
            <div className="product-card__body">
                <span className="product-card__unit">
                    {CATEGORY_EMOJIS[product.category]} {product.unit}
                </span>
                <h3 className="product-card__name">{product.name}</h3>
                <div className="product-card__rating">
                    <FiStar className="star" fill="#f59e0b" stroke="none" size={11} />
                    <span>{product.rating?.toFixed(1)}</span>
                    <span>({product.reviewCount?.toLocaleString()})</span>
                </div>
                <div className="product-card__price-row">
                    <span className="product-card__price">₹{product.price}</span>
                    {discount && (
                        <span className="product-card__original-price">₹{product.originalPrice}</span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="product-card__footer">
                {!isOutOfStock ? (
                    inCart ? (
                        <div className="qty-control" role="group" aria-label="Quantity control">
                            <button className="qty-btn" onClick={handleDecrease} aria-label="Decrease quantity">−</button>
                            <span className="qty-value">{qty}</span>
                            <button className="qty-btn" onClick={handleIncrease} aria-label="Increase quantity">+</button>
                        </div>
                    ) : (
                        <button className="add-btn" onClick={handleAdd} id={`add-btn-${product._id}`}>
                            ADD
                        </button>
                    )
                ) : (
                    <button className="add-btn disabled" disabled style={{ opacity: 0.5 }}>
                        Out of Stock
                    </button>
                )}
            </div>
        </article>
    );
};

export default ProductCard;
