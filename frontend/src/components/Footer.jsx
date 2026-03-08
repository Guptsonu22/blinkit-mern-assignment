import { Link } from "react-router-dom";
import { FiZap, FiGithub, FiShoppingCart, FiPackage } from "react-icons/fi";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">

                    {/* Brand */}
                    <div className="footer__brand">
                        <div className="footer__logo">
                            <div className="footer__logo-icon">
                                <FiZap color="#0c831f" size={16} />
                            </div>
                            <span>
                                <span style={{ color: "#f8c22f", fontWeight: 900 }}>blink</span>
                                <span style={{ color: "#0c831f", fontWeight: 900 }}>it</span>
                            </span>
                        </div>
                        <p className="footer__tagline">
                            Your favourite drinks, delivered in 10 minutes.
                            From fizzy sodas to fresh juices — we've got every sip covered.
                        </p>
                        <a
                            href="https://github.com/Guptsonu22/blinkit-mern-assignment"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer__github-btn"
                        >
                            <FiGithub size={14} />
                            View on GitHub
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__col">
                        <h4 className="footer__col-title">Quick Links</h4>
                        <ul className="footer__links">
                            <li><Link to="/">🏠 Home</Link></li>
                            <li><Link to="/cart">🛒 My Cart</Link></li>
                            <li><a href="/#products">📦 All Products</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="footer__col">
                        <h4 className="footer__col-title">Categories</h4>
                        <ul className="footer__links">
                            <li>🥤 Soft Drinks</li>
                            <li>🍊 Juices</li>
                            <li>⚡ Energy Drinks</li>
                            <li>💧 Water</li>
                            <li>☕ Tea &amp; Coffee</li>
                            <li>🍹 Mocktails</li>
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div className="footer__col">
                        <h4 className="footer__col-title">Tech Stack</h4>
                        <ul className="footer__links footer__tech">
                            <li><span className="footer__tech-badge react">React 19</span></li>
                            <li><span className="footer__tech-badge node">Node.js</span></li>
                            <li><span className="footer__tech-badge mongo">MongoDB</span></li>
                            <li><span className="footer__tech-badge express">Express.js</span></li>
                            <li><span className="footer__tech-badge vite">Vite</span></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="footer__bottom">
                    <p>
                        © {year} <strong>Blinkit Drinks Store</strong> — Built with ❤️ using the MERN Stack
                    </p>
                    <p className="footer__assignment-note">
                        🎓 This project was built as part of a MERN Stack Internship Assignment
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
