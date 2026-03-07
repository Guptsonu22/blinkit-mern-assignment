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

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="cart-item" id={`cart-item-${item._id}`}>
            <img
                src={item.image}
                alt={item.name}
                className="cart-item__img"
                onError={(e) => {
                    e.target.src = `https://placehold.co/80x80/f0fdf4/0c831f?text=${encodeURIComponent(CATEGORY_EMOJIS[item.category] || "🥤")}`;
                }}
            />
            <div className="cart-item__info">
                <div className="cart-item__name">{item.name}</div>
                <div className="cart-item__unit">{item.unit} · {item.brand}</div>
                <div className="cart-item__price">₹{(item.price * item.quantity).toFixed(0)}</div>
                <div className="cart-item__controls">
                    <div className="qty-control" role="group" aria-label="Quantity control" style={{ width: 110 }}>
                        <button
                            className="qty-btn"
                            onClick={() =>
                                item.quantity === 1
                                    ? removeFromCart(item._id)
                                    : updateQuantity(item._id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                    <button
                        className="cart-item__remove"
                        onClick={() => removeFromCart(item._id)}
                        aria-label={`Remove ${item.name} from cart`}
                        id={`remove-btn-${item._id}`}
                    >
                        Remove
                    </button>
                </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>₹{item.price} each</div>
                <div style={{ fontSize: "0.7rem", color: "#d1d5db", marginTop: 4 }}>
                    × {item.quantity}
                </div>
            </div>
        </div>
    );
};

export default CartItem;
