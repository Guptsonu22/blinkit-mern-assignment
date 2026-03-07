import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch, FiZap, FiMapPin } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const Navbar = ({ search, onSearch }) => {
    const { totalItems, totalAmount } = useCart();
    const navigate = useNavigate();

    return (
        <>
            {/* Delivery Topbar */}
            <div className="topbar" role="banner">
                <div className="container topbar__inner">
                    <span className="topbar__delivery">
                        <FiZap size={12} style={{ color: '#f8c22f' }} />
                        Delivery in <strong>10 minutes</strong>
                    </span>
                    <span className="topbar__location">
                        <FiMapPin size={12} />
                        Delivering to: <strong>Your Location</strong>
                    </span>
                    <span className="topbar__promo">🎉 Free delivery on orders above ₹99</span>
                </div>
            </div>
            <nav className="navbar" role="navigation" aria-label="Main navigation">
                <div className="container navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo" id="navbar-logo">
                        <div className="navbar__logo-icon">
                            <FiZap color="#fff" size={18} />
                        </div>
                        <div>
                            <span className="logo-text" style={{ color: "#0c831f", fontWeight: 900 }}>
                                blinkit
                            </span>
                            <span className="navbar__tagline">drinks delivered fast</span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    {onSearch !== undefined && (
                        <div className="navbar__search" role="search">
                            <FiSearch className="navbar__search-icon" aria-hidden="true" />
                            <input
                                id="global-search"
                                type="search"
                                placeholder="Search drinks, brands..."
                                value={search || ""}
                                onChange={(e) => onSearch(e.target.value)}
                                aria-label="Search drinks and brands"
                            />
                        </div>
                    )}

                    {/* Cart */}
                    <div className="navbar__actions">
                        <button
                            id="navbar-cart-btn"
                            className="navbar__cart-btn"
                            onClick={() => navigate("/cart")}
                            aria-label={`Cart with ${totalItems} items`}
                        >
                            <FiShoppingCart size={18} />
                            {totalItems > 0 && (
                                <>
                                    <span className="cart-badge">{totalItems} {totalItems > 1 ? "items" : "item"}</span>
                                    <span className="navbar__cart-amount">
                                        | ₹{totalAmount.toFixed(0)}
                                    </span>
                                </>
                            )}
                            {totalItems === 0 && <span>My Cart</span>}
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
