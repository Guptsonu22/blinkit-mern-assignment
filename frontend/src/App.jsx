import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9rem",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "120px 24px" }}>
                <h1 style={{ fontSize: "5rem", fontWeight: 900, color: "#0c831f" }}>404</h1>
                <p style={{ color: "#6b7280", marginBottom: 24 }}>Page not found</p>
                <a
                  href="/"
                  style={{
                    background: "#0c831f",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Go Home
                </a>
              </div>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
