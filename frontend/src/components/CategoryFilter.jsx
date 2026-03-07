const CATEGORIES = [
    { label: "All", emoji: "🛒" },
    { label: "Soft Drinks", emoji: "🥤" },
    { label: "Juices", emoji: "🍊" },
    { label: "Energy Drinks", emoji: "⚡" },
    { label: "Water", emoji: "💧" },
    { label: "Tea & Coffee", emoji: "☕" },
    { label: "Dairy Drinks", emoji: "🥛" },
    { label: "Sports Drinks", emoji: "🏃" },
    { label: "Mocktails", emoji: "🍹" },
];

const CategoryFilter = ({ selected, onChange }) => {
    return (
        <section className="categories-section" aria-label="Product categories">
            <div className="categories-scroll" role="tablist">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.label}
                        id={`category-${cat.label.replace(/\s+/g, "-").toLowerCase()}`}
                        role="tab"
                        aria-selected={selected === cat.label}
                        className={`category-chip ${selected === cat.label ? "active" : ""}`}
                        onClick={() => onChange(cat.label)}
                    >
                        <span aria-hidden="true">{cat.emoji}</span>
                        {cat.label}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CategoryFilter;
export { CATEGORIES };
