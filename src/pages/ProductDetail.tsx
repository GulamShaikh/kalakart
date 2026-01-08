import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Mail, Clock, Check, Plus, Minus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import demoData from '@/data/demo-data.json';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const product = demoData.products.find(p => p.id === id);

  const [currentImage, setCurrentImage] = useState(0);
  const [serviceType, setServiceType] = useState<'home-visit' | 'digital'>(
    product?.serviceTypes.includes('home-visit') ? 'home-visit' : 'digital'
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <p className="text-4xl mb-4">😕</p>
          <h1 className="font-display font-bold text-xl">Product not found</h1>
          <Link to="/explore">
            <Button className="mt-4">Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const addOnsTotal = selectedAddOns.reduce((sum, addonId) => {
      const addon = product.addOns.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return (product.price + addOnsTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (serviceType === 'home-visit' && (!selectedDate || !selectedTime)) {
      toast({
        title: "Select date & time",
        description: "Please choose a date and time slot for home visit",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      title: product.title,
      image: product.images[0],
      price: product.price,
      artistId: product.artistId,
      artistName: product.artistName,
      serviceType,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      quantity,
      addOns: selectedAddOns.map(id => {
        const addon = product.addOns.find(a => a.id === id);
        return addon ? { id: addon.id, name: addon.name, price: addon.price } : { id, name: '', price: 0 };
      }).filter(a => a.name),
    });

    toast({
      title: "Added to cart! 🎉",
      description: `${product.title} has been added to your cart`,
    });

    navigate('/checkout');
  };

  // Demo date options (next 7 days)
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + product.leadTime + i);
    return date.toISOString().split('T')[0];
  });

  const timeSlots = ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  return (
    <Layout>
      <div className="container px-4 py-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <img
                src={product.images[currentImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage(i => i > 0 ? i - 1 : product.images.length - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage(i => i < product.images.length - 1 ? i + 1 : 0)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={cn(
                      "shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                      currentImage === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <div className="flex gap-2 mb-2">
                {product.serviceTypes.includes('home-visit') && (
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    <MapPin className="w-3 h-3 mr-1" />
                    Home Visit
                  </Badge>
                )}
                {product.serviceTypes.includes('digital') && (
                  <Badge variant="outline">
                    <Mail className="w-3 h-3 mr-1" />
                    Digital
                  </Badge>
                )}
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl">{product.title}</h1>
            </div>

            {/* Artist */}
            <Link to={`/artist/${product.artistId}`} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <img src={product.artistAvatar} alt={product.artistName} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{product.artistName}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span>{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>
            </Link>

            {/* Price */}
            <div>
              <p className="text-sm text-muted-foreground">Starting at</p>
              <p className="font-display font-bold text-3xl text-primary">₹{product.price.toLocaleString()}</p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground">{product.description}</p>

            {/* Lead time */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Minimum {product.leadTime} days advance booking</span>
            </div>

            {/* Service Type Selection */}
            {product.serviceTypes.length > 1 && (
              <div>
                <label className="text-sm font-medium block mb-2">Service Type</label>
                <div className="flex gap-2">
                  {product.serviceTypes.includes('home-visit') && (
                    <button
                      onClick={() => setServiceType('home-visit')}
                      className={cn(
                        "flex-1 p-3 rounded-lg border-2 text-left transition-all",
                        serviceType === 'home-visit'
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <MapPin className={cn("w-4 h-4 mb-1", serviceType === 'home-visit' ? "text-primary" : "text-muted-foreground")} />
                      <p className="font-medium text-sm">Home Visit</p>
                      <p className="text-xs text-muted-foreground">Artist comes to you</p>
                    </button>
                  )}
                  {product.serviceTypes.includes('digital') && (
                    <button
                      onClick={() => setServiceType('digital')}
                      className={cn(
                        "flex-1 p-3 rounded-lg border-2 text-left transition-all",
                        serviceType === 'digital'
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Mail className={cn("w-4 h-4 mb-1", serviceType === 'digital' ? "text-primary" : "text-muted-foreground")} />
                      <p className="font-medium text-sm">Digital Delivery</p>
                      <p className="text-xs text-muted-foreground">Shipped to your address</p>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Date & Time Selection (for home visit) */}
            {serviceType === 'home-visit' && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Select Date
                  </label>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {dateOptions.map(date => {
                      const d = new Date(date);
                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            "shrink-0 w-16 p-2 rounded-lg border text-center transition-all",
                            selectedDate === date
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <p className="text-xs text-muted-foreground">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                          <p className="font-semibold">{d.getDate()}</p>
                          <p className="text-xs text-muted-foreground">{d.toLocaleDateString('en-IN', { month: 'short' })}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium block mb-2">Select Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "p-2 rounded-lg border text-sm font-medium transition-all",
                            selectedTime === time
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add-ons */}
            {product.addOns.length > 0 && (
              <div>
                <label className="text-sm font-medium block mb-2">Add-ons</label>
                <div className="space-y-2">
                  {product.addOns.map(addon => (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                        selectedAddOns.includes(addon.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          selectedAddOns.includes(addon.id)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30"
                        )}>
                          {selectedAddOns.includes(addon.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span className="font-medium">{addon.name}</span>
                      </div>
                      <span className="text-primary font-semibold">+₹{addon.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total & Book */}
            <div className="sticky bottom-20 md:bottom-0 bg-card border-t border-border pt-4 -mx-4 px-4 md:mx-0 md:px-0 md:border-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display font-bold text-2xl text-primary">₹{calculateTotal().toLocaleString()}</span>
              </div>
              <Button variant="hero" size="lg" className="w-full" onClick={handleAddToCart}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
