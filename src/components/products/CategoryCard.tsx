import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  image: string;
  count: number;
  className?: string;
}

export function CategoryCard({ id, name, icon, image, count, className }: CategoryCardProps) {
  return (
    <Link
      to={`/explore?category=${id}`}
      className={cn(
        "group relative flex flex-col items-center justify-center min-w-[100px] md:min-w-[140px] h-28 md:h-36 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]",
        className
      )}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-primary-foreground">
        <span className="text-2xl md:text-3xl">{icon}</span>
        <h3 className="font-display font-semibold text-sm md:text-base mt-1">{name}</h3>
        <p className="text-[10px] md:text-xs opacity-80">{count} items</p>
      </div>
    </Link>
  );
}
