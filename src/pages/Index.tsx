import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '@/components/products/CategoryCard';
import { ProductCard } from '@/components/products/ProductCard';
import demoData from '@/data/demo-data.json';

export default function Index() {
  const featuredProducts = demoData.products.filter(p => p.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container px-4 py-8 md:py-16">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-full text-sm font-medium text-accent-foreground mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Celebrating Indian Artistry</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl leading-tight">
              Handmade{' '}
              <span className="text-gradient">Torans, Rangoli</span>
              {' '}&amp; Festival Décor
            </h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
              From home artists to your home. Discover authentic handcrafted decorations for every celebration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link to="/explore">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Explore Artisans
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Become an Artist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 md:py-10">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg md:text-xl">Browse Categories</h2>
            <Link to="/explore" className="text-sm text-primary font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {demoData.categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                icon={category.icon}
                image={category.image}
                count={category.count}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-6 md:py-10 bg-muted/30">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg md:text-xl">Featured Creations</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Handpicked by our team</p>
            </div>
            <Link to="/explore" className="text-sm text-primary font-medium hover:underline">
              See more
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map((product) => (
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
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-8 md:py-12">
        <div className="container px-4">
          <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '500+', label: 'Local Artists' },
                { value: '10K+', label: 'Happy Customers' },
                { value: '4.8★', label: 'Average Rating' },
                { value: '15+', label: 'Cities Served' },
              ].map((stat, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <p className="font-display font-bold text-2xl md:text-3xl text-gradient">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
