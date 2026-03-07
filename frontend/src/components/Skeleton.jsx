const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-img skeleton" />
        <div className="skeleton-body">
            <div className="skeleton-line short skeleton" />
            <div className="skeleton-line wide skeleton" />
            <div className="skeleton-line medium skeleton" />
            <div className="skeleton-line medium skeleton" />
        </div>
    </div>
);

const SkeletonGrid = ({ count = 12 }) => (
    <div className="products-grid">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

export { SkeletonCard, SkeletonGrid };
