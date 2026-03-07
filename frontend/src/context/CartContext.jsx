import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const existing = state.items.find((i) => i._id === action.payload._id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case "REMOVE_FROM_CART":
            return { ...state, items: state.items.filter((i) => i._id !== action.payload) };
        case "UPDATE_QUANTITY": {
            if (action.payload.quantity <= 0) {
                return { ...state, items: state.items.filter((i) => i._id !== action.payload.id) };
            }
            return {
                ...state,
                items: state.items.map((i) =>
                    i._id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
                ),
            };
        }
        case "CLEAR_CART":
            return { ...state, items: [] };
        case "LOAD_CART":
            return { ...state, items: action.payload };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    // ✅ Lazy initializer: load from localStorage SYNCHRONOUSLY as the first state
    // This prevents the race condition where the save effect fires with [] before
    // the load effect can restore the cart (which was wiping the cart on every refresh)
    const [state, dispatch] = useReducer(cartReducer, undefined, () => {
        try {
            const stored = localStorage.getItem("blinkit_cart");
            return { items: stored ? JSON.parse(stored) : [] };
        } catch {
            return { items: [] };
        }
    });

    // ✅ Persist to localStorage every time cart changes (save only — no load needed)
    useEffect(() => {
        localStorage.setItem("blinkit_cart", JSON.stringify(state.items));
    }, [state.items]);

    const addToCart = (product) => dispatch({ type: "ADD_TO_CART", payload: product });
    const removeFromCart = (id) => dispatch({ type: "REMOVE_FROM_CART", payload: id });
    const updateQuantity = (id, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    const clearCart = () => dispatch({ type: "CLEAR_CART" });

    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const isInCart = (id) => state.items.some((i) => i._id === id);
    const getQuantity = (id) => state.items.find((i) => i._id === id)?.quantity || 0;

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                totalItems,
                totalAmount,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isInCart,
                getQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
};
