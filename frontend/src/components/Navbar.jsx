import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch, FiZap, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";

const POPULAR_SEARCHES = ["Coca-Cola", "Red Bull", "Tropicana", "Bisleri", "Monster", "Sprite", "Pepsi", "Green Tea"];

const Navbar = ({ search, onSearch }) => {
    const { totalItems, totalAmount } = useCart();
    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const searchRef = useRef(null);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);

    // Fetch suggestions when search changes
    useEffect(() => {
        if (!search || search.trim().length < 1) {
            setSuggestions([]);
            setActiveIndex(-1);
            return;
        }

        clearTimeout(debounceRef.current);
        setLoadingSuggestions(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const { data } = await getProducts({ search: search.trim(), limit: 6 });
                setSuggestions(data.data || []);
            } catch {
                setSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        }, 250);

        return () => clearTimeout(debounceRef.current);
    }, [search]);

    // Click outside → close dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                searchRef.current && !searchRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = useCallback((e) => {
        if (!showDropdown) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            const selected = suggestions[activeIndex];
            if (selected) handleSuggestionClick(selected);
        } else if (e.key === "Escape") {
            setShowDropdown(false);
            setActiveIndex(-1);
        }
    }, [showDropdown, suggestions, activeIndex]);

    const handleSuggestionClick = (product) => {
        setShowDropdown(false);
        setActiveIndex(-1);
        onSearch("");
        navigate(`/product/${product._id}`);
    };

    const handlePopularClick = (term) => {
        onSearch(term);
        setShowDropdown(true);
    };

    const clearSearch = () => {
        onSearch("");
        setSuggestions([]);
        setShowDropdown(false);
        searchRef.current?.focus();
    };

    const isDropdownVisible = showDropdown && (search?.length > 0 || true);

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="container navbar__inner">

                {/* Logo */}
                <Link to="/" className="navbar__logo" id="navbar-logo">
                    <div className="navbar__logo-icon">
                        <FiZap color="#0c831f" size={18} />
                    </div>
                    <div>
                        <span className="logo-text">
                            <span style={{ color: "#f8c22f" }}>blink</span><span style={{ color: "#0c831f" }}>it</span>
                        </span>
                        <span className="navbar__tagline">drinks delivered fast</span>
                    </div>
                </Link>

                {/* Search Bar with Suggestions */}
                {onSearch !== undefined && (
                    <div className="navbar__search" role="search" ref={searchRef}>
                        <FiSearch className="navbar__search-icon" aria-hidden="true" />
                        <input
                            id="global-search"
                            type="search"
                            autoComplete="off"
                            placeholder="Search drinks, brands..."
                            value={search || ""}
                            onChange={(e) => {
                                onSearch(e.target.value);
                                setShowDropdown(true);
                                setActiveIndex(-1);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            onKeyDown={handleKeyDown}
                            aria-label="Search drinks and brands"
                            aria-expanded={showDropdown}
                            aria-autocomplete="list"
                        />
                        {search && (
                            <button className="navbar__search-clear" onClick={clearSearch} aria-label="Clear search">
                                <FiX size={14} />
                            </button>
                        )}

                        {/* Suggestions Dropdown */}
                        {showDropdown && (
                            <div className="suggestions-dropdown" ref={dropdownRef} role="listbox">

                                {/* Popular searches (shown when input is empty) */}
                                {!search && (
                                    <>
                                        <div className="suggestions-label">🔥 Popular Searches</div>
                                        <div className="suggestions-popular">
                                            {POPULAR_SEARCHES.map((term) => (
                                                <button
                                                    key={term}
                                                    className="suggestion-popular-tag"
                                                    onClick={() => handlePopularClick(term)}
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Loading state */}
                                {search && loadingSuggestions && (
                                    <div className="suggestions-loading">
                                        <span>Searching...</span>
                                    </div>
                                )}

                                {/* Results */}
                                {search && !loadingSuggestions && suggestions.length > 0 && (
                                    <>
                                        <div className="suggestions-label">🔍 Results for "{search}"</div>
                                        {suggestions.map((product, idx) => (
                                            <div
                                                key={product._id}
                                                className={`suggestion-item ${idx === activeIndex ? "active" : ""}`}
                                                role="option"
                                                aria-selected={idx === activeIndex}
                                                onClick={() => handleSuggestionClick(product)}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="suggestion-item__img"
                                                    onError={(e) => { e.target.src = "https://via.placeholder.com/40x40?text=🥤"; }}
                                                />
                                                <div className="suggestion-item__info">
                                                    <span className="suggestion-item__name">{product.name}</span>
                                                    <span className="suggestion-item__meta">{product.category} · {product.unit}</span>
                                                </div>
                                                <span className="suggestion-item__price">₹{product.price}</span>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* No results */}
                                {search && !loadingSuggestions && suggestions.length === 0 && (
                                    <div className="suggestions-empty">
                                        <span>😕 No results for "{search}"</span>
                                    </div>
                                )}
                            </div>
                        )}
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
    );
};

export default Navbar;
