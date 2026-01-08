import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Package, DollarSign, TrendingUp, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useToast } from '@/hooks/use-toast';
import demoData from '@/data/demo-data.json';

export default function ArtistDashboard() {
  const { user, requestPayout } = useAuth();
  const { getArtistOrders, updateOrderStatus } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('kalakart_artist_listings');
    if (saved) return JSON.parse(saved);
    return demoData.products.filter(p => p.artistId === user?.id);
  });

  if (!user || user.role !== 'artist') {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <h1 className="font-display font-bold text-xl">Artist Dashboard</h1>
          <p className="text-muted-foreground mt-2">Please login as an artist to access this page</p>
          <Link to="/login">
            <Button className="mt-4">Login as Artist</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const orders = getArtistOrders(user.id);
  const pendingOrders = orders.filter(o => o.status === 'confirmed');

  const handlePayout = () => {
    requestPayout();
    toast({
      title: "Payout Requested! 💰",
      description: "Your payout request has been submitted (demo)",
    });
  };

  const toggleListing = (productId: string) => {
    setListings((prev: any[]) => {
      const updated = prev.map((p: any) =>
        p.id === productId ? { ...p, disabled: !p.disabled } : p
      );
      localStorage.setItem('kalakart_artist_listings', JSON.stringify(updated));
      return updated;
    });
    toast({ title: "Listing updated!" });
  };

  const handleOrderAction = (orderId: string, action: 'accept' | 'decline') => {
    updateOrderStatus(orderId, action === 'accept' ? 'scheduled' : 'cancelled');
    toast({
      title: action === 'accept' ? "Order accepted! 🎉" : "Order declined",
      description: action === 'accept' ? "The customer will be notified" : "The customer will be refunded",
    });
  };

  return (
    <Layout>
      <div className="container px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl">Artist Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
          <Link to="/artist/upload">
            <Button variant="hero" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Listing
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-card rounded-xl shadow-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs">Total Earnings</span>
            </div>
            <p className="font-display font-bold text-2xl text-primary">₹{(user.earnings || 0).toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Pending Payout</span>
            </div>
            <p className="font-display font-bold text-2xl text-secondary">₹{(user.pendingPayout || 0).toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="w-4 h-4" />
              <span className="text-xs">Total Orders</span>
            </div>
            <p className="font-display font-bold text-2xl">{user.totalOrders || 0}</p>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">Active Listings</span>
            </div>
            <p className="font-display font-bold text-2xl">{listings.filter((l: any) => !l.disabled).length}</p>
          </div>
        </div>

        {/* Payout Button */}
        {(user.pendingPayout || 0) > 0 && (
          <div className="bg-secondary/10 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="font-medium">Ready for payout</p>
              <p className="text-sm text-muted-foreground">₹{(user.pendingPayout || 0).toLocaleString()} available</p>
            </div>
            <Button variant="success" onClick={handlePayout}>
              Request Payout
            </Button>
          </div>
        )}

        {/* Pending Orders */}
        {pendingOrders.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Pending Orders ({pendingOrders.length})
            </h2>
            <div className="space-y-3">
              {pendingOrders.map(order => (
                <div key={order.id} className="bg-card rounded-xl shadow-card p-4">
                  <div className="flex gap-3">
                    <img src={order.productImage} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-1">{order.productTitle}</h3>
                      <p className="text-xs text-muted-foreground">
                        {order.serviceType === 'home-visit' ? '🏠 Home Visit' : '📧 Digital'} • {order.scheduledDate && new Date(order.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="font-semibold text-primary mt-1">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="success"
                      className="flex-1"
                      onClick={() => handleOrderAction(order.id, 'accept')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleOrderAction(order.id, 'decline')}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Listings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">My Listings</h2>
            <Link to="/artist/upload" className="text-sm text-primary font-medium hover:underline">
              + Add new
            </Link>
          </div>
          {listings.length === 0 ? (
            <div className="bg-card rounded-xl shadow-card p-8 text-center">
              <p className="text-muted-foreground">No listings yet</p>
              <Link to="/artist/upload">
                <Button className="mt-4">Create Your First Listing</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((listing: any) => (
                <div
                  key={listing.id}
                  className={`bg-card rounded-xl shadow-card p-4 ${listing.disabled ? 'opacity-60' : ''}`}
                >
                  <div className="flex gap-3">
                    <img src={listing.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium line-clamp-1">{listing.title}</h3>
                        <Badge variant={listing.disabled ? 'outline' : 'secondary'} className="shrink-0 text-xs">
                          {listing.disabled ? 'Disabled' : 'Active'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{listing.category}</p>
                      <p className="font-semibold text-primary mt-1">₹{listing.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => navigate(`/product/${listing.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => toggleListing(listing.id)}
                    >
                      {listing.disabled ? (
                        <>
                          <ToggleLeft className="w-4 h-4 mr-1" />
                          Enable
                        </>
                      ) : (
                        <>
                          <ToggleRight className="w-4 h-4 mr-1" />
                          Disable
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
