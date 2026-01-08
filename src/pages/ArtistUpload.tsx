import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Image, MapPin, Mail } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import demoData from '@/data/demo-data.json';

export default function ArtistUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    leadTime: '2',
    homeVisit: true,
    digital: false,
    locationRadius: '15',
  });

  const [images, setImages] = useState<string[]>([]);

  if (!user || user.role !== 'artist') {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <h1 className="font-display font-bold text-xl">Upload Listing</h1>
          <p className="text-muted-foreground mt-2">Please login as an artist</p>
          <Link to="/login">
            <Button className="mt-4">Login as Artist</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Demo: Use placeholder images
    const demoImages = [
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop',
    ];

    setImages(prev => [...prev, demoImages[prev.length % 3]].slice(0, 5));
    toast({ title: "Image added! 📸", description: "Demo: Using placeholder image" });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.price || images.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields and add at least one image",
        variant: "destructive",
      });
      return;
    }

    // Create new listing (demo)
    const newListing = {
      id: `prod-${Date.now()}`,
      title: formData.title,
      artistId: user.id,
      artistName: user.name,
      artistAvatar: user.avatar,
      category: formData.category,
      price: parseInt(formData.price),
      rating: 0,
      reviews: 0,
      serviceTypes: [
        ...(formData.homeVisit ? ['home-visit'] : []),
        ...(formData.digital ? ['digital'] : []),
      ],
      leadTime: parseInt(formData.leadTime),
      description: formData.description,
      images,
      locationRadius: formData.homeVisit ? parseInt(formData.locationRadius) : null,
      featured: false,
      addOns: [],
      disabled: false,
    };

    // Save to localStorage
    const existingListings = JSON.parse(localStorage.getItem('kalakart_artist_listings') || '[]');
    const demoListings = demoData.products.filter(p => p.artistId === user.id);
    localStorage.setItem('kalakart_artist_listings', JSON.stringify([...demoListings, ...existingListings.filter((l: any) => !demoData.products.some(d => d.id === l.id)), newListing]));

    toast({
      title: "Listing created! 🎉",
      description: "Your listing is now live",
    });

    navigate('/artist/dashboard');
  };

  return (
    <Layout>
      <div className="container px-4 py-4 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="font-display font-bold text-2xl mb-6">Create New Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div>
            <Label>Photos (up to 5)</Label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-foreground/80 rounded-full flex items-center justify-center text-background hover:bg-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Max 2MB per image. 4:3 aspect ratio recommended.</p>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Traditional Diwali Rangoli Design"
              maxLength={100}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Select category</option>
              {demoData.categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={e => setFormData(f => ({ ...f, price: e.target.value }))}
              placeholder="2500"
              min="100"
            />
          </div>

          {/* Service Types */}
          <div>
            <Label>Service Type *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, homeVisit: !f.homeVisit }))}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  formData.homeVisit
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <MapPin className={cn("w-5 h-5 mb-1", formData.homeVisit ? "text-primary" : "text-muted-foreground")} />
                <p className="font-medium text-sm">Home Visit</p>
                <p className="text-xs text-muted-foreground">You go to customer</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, digital: !f.digital }))}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  formData.digital
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Mail className={cn("w-5 h-5 mb-1", formData.digital ? "text-primary" : "text-muted-foreground")} />
                <p className="font-medium text-sm">Digital / Shipping</p>
                <p className="text-xs text-muted-foreground">Deliver to customer</p>
              </button>
            </div>
          </div>

          {/* Lead Time */}
          <div>
            <Label htmlFor="leadTime">Lead Time (days)</Label>
            <Input
              id="leadTime"
              type="number"
              value={formData.leadTime}
              onChange={e => setFormData(f => ({ ...f, leadTime: e.target.value }))}
              placeholder="2"
              min="1"
              max="30"
            />
            <p className="text-xs text-muted-foreground mt-1">Minimum advance booking required</p>
          </div>

          {/* Location Radius (for home visit) */}
          {formData.homeVisit && (
            <div>
              <Label htmlFor="locationRadius">Service Radius (km)</Label>
              <Input
                id="locationRadius"
                type="number"
                value={formData.locationRadius}
                onChange={e => setFormData(f => ({ ...f, locationRadius: e.target.value }))}
                placeholder="15"
                min="1"
                max="100"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe your service or product..."
              maxLength={300}
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/300 characters</p>
          </div>

          {/* Submit */}
          <div className="sticky bottom-20 md:bottom-4 bg-background pt-4">
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Publish Listing
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
