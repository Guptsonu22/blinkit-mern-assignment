import { useState, useEffect, useCallback, useRef } from "react";

import { FiZap, FiTruck } from "react-icons/fi";
import Navbar from "../components/Navbar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import { SkeletonGrid } from "../components/Skeleton";
import { getProducts } from "../services/api";

const LIMIT = 12;

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const debounceRef = useRef(null);
    const isInitialMount = useRef(true);

    const fetchProducts = useCallback(async (q, cat, pg) => {
        setLoading(true);
        setError(null);
        try {
            const params = { page: pg, limit: LIMIT };
            if (q) params.search = q;
            if (cat && cat !== "All") params.category = cat;
            const { data } = await getProducts(params);
            setProducts(data.data);
            setPagination(data.pagination);
        } catch (err) {
            setError("Couldn't load products. Is the backend running?");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchProducts("", "All", 1);
    }, [fetchProducts]);

    // Debounce search & category — resets page to 1
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            fetchProducts(search, category, 1);
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search, category, fetchProducts]);

    // Page change (only when user clicks pagination, not from above reset)
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchProducts(search, category, newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCategoryChange = (cat) => {
        setCategory(cat);
    };

    const totalPages = pagination?.totalPages || 1;
    const pageNumbers = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);

    return (
        <div className="page" id="home-page">
            <Navbar search={search} onSearch={setSearch} />

            {/* Hero Banner */}
            <section className="hero" aria-label="Hero banner">
                <div className="container hero__inner">
                    <div className="hero__content">
                        <div className="hero__badge">
                            <FiZap size={12} />
                            10-MINUTE DELIVERY
                        </div>
                        <h1 className="hero__title">
                            Your favourite <span>drinks</span>,<br />
                            delivered in <span>10 mins</span>
                        </h1>
                        <p className="hero__subtitle">
                            From fizzy sodas to fresh juices & energy drinks — we've got every sip covered.
                        </p>
                        <a href="#products" className="hero__cta">
                            <FiTruck size={16} /> Shop Now
                        </a>
                    </div>

                    <div className="hero__emoji-grid" aria-hidden="true">
                        {[
                            { e: "🥤", l: "Soft Drinks" },
                            { e: "🍊", l: "Juices" },
                            { e: "⚡", l: "Energy" },
                            { e: "💧", l: "Water" },
                            { e: "☕", l: "Tea & Coffee" },
                            { e: "🍹", l: "Mocktails" },
                        ].map((item) => (
                            <div
                                key={item.l}
                                className="hero__emoji-card"
                                onClick={() => handleCategoryChange(item.l)}
                                style={{ cursor: "pointer" }}
                            >
                                <span className="emoji">{item.e}</span>
                                <span className="label">{item.l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <div className="container">
                <CategoryFilter selected={category} onChange={handleCategoryChange} />
            </div>

            {/* Products Section */}
            <main id="products" className="container">
                {/* Popular Drinks */}
                {category === "All" && !search && page === 1 && !loading && !error && (
                    <div className="popular-drinks-section" style={{ marginBottom: 32 }}>
                        <div className="section-header">
                            <h2>🔥 Trending Drinks</h2>
                        </div>
                        <div className="products-grid">
                            {products.filter(p => p.isFeatured).slice(0, 5).map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
                <div className="section-header">
                    <h2>
                        {category !== "All" ? `${category}` : "All Drinks"}
                        {search ? ` — "${search}"` : ""}
                    </h2>
                    {pagination && !loading && (
                        <span className="section-header__meta">
                            {pagination.total} product{pagination.total !== 1 ? "s" : ""} found
                        </span>
                    )}
                </div>

                {loading ? (
                    <SkeletonGrid count={12} />
                ) : error ? (
                    <div className="error-state">
                        <h2>⚠️ Oops!</h2>
                        <p>{error}</p>
                        <button className="back-btn" onClick={() => fetchProducts(search, category, page)}>
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-state__icon">🔍</span>
                        <h3>No drinks found</h3>
                        <p>Try a different search term or category.</p>
                    </div>
                ) : (
                    <div className="products-grid" id="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && pagination && pagination.totalPages > 1 && (
                    <nav className="pagination" aria-label="Pagination">
                        <button
                            id="prev-page-btn"
                            className="page-btn"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={!pagination.hasPrevPage}
                            aria-label="Previous page"
                        >
                            ← Prev
                        </button>
                        {pageNumbers.map((n) => (
                            <button
                                key={n}
                                id={`page-btn-${n}`}
                                className={`page-btn ${page === n ? "active" : ""}`}
                                onClick={() => handlePageChange(n)}
                                aria-current={page === n ? "page" : undefined}
                            >
                                {n}
                            </button>
                        ))}
                        {totalPages > 7 && page < totalPages - 3 && <span className="page-btn" style={{ border: "none" }}>…</span>}
                        {totalPages > 7 && (
                            <button
                                id={`page-btn-${totalPages}`}
                                className={`page-btn ${page === totalPages ? "active" : ""}`}
                                onClick={() => handlePageChange(totalPages)}
                            >
                                {totalPages}
                            </button>
                        )}
                        <button
                            id="next-page-btn"
                            className="page-btn"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={!pagination.hasNextPage}
                            aria-label="Next page"
                        >
                            Next →
                        </button>
                    </nav>
                )}
            </main>
        </div>
    );
};

export default Home;
