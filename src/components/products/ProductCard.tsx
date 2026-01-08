import { Star, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  artistName: string;
  serviceTypes: ('home-visit' | 'digital')[];
  className?: string;
}

export function ProductCard({
  id,
  title,
  image,
  price,
  rating,
  reviews,
  artistName,
  serviceTypes,
  className,
}: ProductCardProps) {
  return (
    <Link
      to={`/product/${id}`}
      className={cn(
        "group block bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Service badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {serviceTypes.includes('home-visit') && (
            <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground text-[10px] px-1.5 py-0.5">
              <MapPin className="w-3 h-3 mr-0.5" />
              Home Visit
            </Badge>
          )}
          {serviceTypes.includes('digital') && (
            <Badge variant="outline" className="bg-card/90 text-[10px] px-1.5 py-0.5">
              <Mail className="w-3 h-3 mr-0.5" />
              Digital
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-display font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">by {artistName}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xs text-muted-foreground">Starting at</span>
            <p className="font-display font-bold text-lg text-primary">₹{price.toLocaleString()}</p>
          </div>
          <Button size="sm" className="h-8 px-3 text-xs">
            Book
          </Button>
        </div>
      </div>
    </Link>
  );
}
