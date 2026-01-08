import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import demoData from '@/data/demo-data.json';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  const serviceFilter = searchParams.get('service');
  const sortBy = searchParams.get('sort') || 'popular';

  const filteredProducts = useMemo(() => {
    let products = [...demoData.products];

    // Category filter
    if (categoryFilter) {
      products = products.filter(p => p.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      products = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery) ||
        p.artistName.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
      );
    }

    // Service type filter
    if (serviceFilter) {
      products = products.filter(p => p.serviceTypes.includes(serviceFilter));
    }

    // Sorting
    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    return products;
  }, [categoryFilter, searchQuery, serviceFilter, sortBy]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = [categoryFilter, serviceFilter, sortBy !== 'popular' ? sortBy : null].filter(Boolean).length;

  return (
    <Layout>
      <div className="container px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display font-bold text-xl md:text-2xl">
              {categoryFilter
                ? demoData.categories.find(c => c.id === categoryFilter)?.name || 'Explore'
                : searchQuery
                  ? `Results for "${searchQuery}"`
                  : 'Explore All'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Category pills (horizontal scroll) */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4 mb-4">
          <button
            onClick={() => updateFilter('category', null)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
              !categoryFilter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All
          </button>
          {demoData.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.id)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                categoryFilter === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card rounded-xl shadow-card p-4 mb-4 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Filters</h3>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-primary font-medium">
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Service Type */}
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Service Type</label>
                <div className="flex flex-col gap-2">
                  {['home-visit', 'digital'].map(type => (
                    <button
                      key={type}
                      onClick={() => updateFilter('service', serviceFilter === type ? null : type)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-medium text-left transition-all",
                        serviceFilter === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {type === 'home-visit' ? '🏠 Home Visit' : '📧 Digital Delivery'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Sort By</label>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'popular', label: 'Popular' },
                    { id: 'price-low', label: 'Price: Low to High' },
                    { id: 'price-high', label: 'Price: High to Low' },
                    { id: 'rating', label: 'Top Rated' },
                  ].map(sort => (
                    <button
                      key={sort.id}
                      onClick={() => updateFilter('sort', sort.id === 'popular' ? null : sort.id)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-medium text-left transition-all",
                        sortBy === sort.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryFilter && (
              <Badge variant="secondary" className="gap-1">
                {demoData.categories.find(c => c.id === categoryFilter)?.name}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', null)} />
              </Badge>
            )}
            {serviceFilter && (
              <Badge variant="secondary" className="gap-1">
                {serviceFilter === 'home-visit' ? 'Home Visit' : 'Digital'}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('service', null)} />
              </Badge>
            )}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                image={product.images[0]}
                price={product.price}
                rating={product.rating}
                reviews={product.reviews}
                artistName={product.artistName}
                serviceTypes={product.serviceTypes as ('home-visit' | 'digital')[]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🎨</p>
            <h3 className="font-display font-semibold text-lg">No items found</h3>
            <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
