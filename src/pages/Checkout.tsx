import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, MapPin, Mail, Calendar, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymentModal } from '@/components/checkout/PaymentModal';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, Order } from '@/contexts/OrderContext';
import { useToast } from '@/hooks/use-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, removeItem, getTotal, clearCart } = useCart();
  const { user, updateEarnings } = useAuth();
  const { addOrder } = useOrders();
  const { toast } = useToast();

  const [showPayment, setShowPayment] = useState(false);
  const [address, setAddress] = useState({
    line1: user?.address?.line1 || '',
    line2: user?.address?.line2 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    phone: user?.phone || '',
  });

  const { subtotal, tax, total } = getTotal();

  const handlePaymentSuccess = (transactionId: string) => {
    // Create orders for each item
    items.forEach(item => {
      const newOrder: Order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        transactionId,
        customerId: user?.id || 'guest',
        artistId: item.artistId,
        productId: item.productId,
        productTitle: item.title,
        productImage: item.image,
        serviceType: item.serviceType,
        scheduledDate: item.scheduledDate || null,
        scheduledTime: item.scheduledTime || null,
        status: 'confirmed',
        price: item.price,
        addOns: item.addOns.map(a => ({ name: a.name, price: a.price })),
        tax: Math.round(item.price * 0.05),
        total: Math.round(item.price * 1.05 + item.addOns.reduce((s, a) => s + a.price, 0)),
        address: `${address.line1}, ${address.line2}, ${address.city}, ${address.state} - ${address.pincode}`,
        createdAt: new Date().toISOString(),
      };
      addOrder(newOrder);

      // Update artist earnings (demo)
      if (user?.role === 'artist' && user.id === item.artistId) {
        updateEarnings(item.price);
      }
    });

    clearCart();
    setShowPayment(false);
    navigate(`/order-success?txn=${transactionId}`);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <p className="text-4xl mb-4">🔐</p>
          <h1 className="font-display font-bold text-xl">Please login to checkout</h1>
          <p className="text-muted-foreground mt-2">You need to be logged in to place an order</p>
          <Link to="/login">
            <Button className="mt-4">Login / Sign Up</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h1 className="font-display font-bold text-xl">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Explore our artisan creations and add items to your cart</p>
          <Link to="/explore">
            <Button className="mt-4">Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="font-display font-bold text-2xl mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-xl shadow-card p-4">
              <h2 className="font-semibold mb-4">Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})</h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.productId} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <img src={item.image} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">by {item.artistName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.serviceType === 'home-visit' ? (
                          <span className="inline-flex items-center text-xs text-secondary">
                            <MapPin className="w-3 h-3 mr-0.5" />
                            Home Visit
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-0.5" />
                            Digital
                          </span>
                        )}
                        {item.scheduledDate && (
                          <span className="inline-flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-0.5" />
                            {new Date(item.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                        {item.scheduledTime && (
                          <span className="inline-flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-0.5" />
                            {item.scheduledTime}
                          </span>
                        )}
                      </div>
                      {item.addOns.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          + {item.addOns.map(a => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹{item.price.toLocaleString()}</p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-destructive hover:underline mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Form */}
            <div className="bg-card rounded-xl shadow-card p-4">
              <h2 className="font-semibold mb-4">Delivery Address</h2>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="line1">Address Line 1</Label>
                    <Input
                      id="line1"
                      value={address.line1}
                      onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))}
                      placeholder="House/Flat No."
                    />
                  </div>
                  <div>
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      value={address.line2}
                      onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))}
                      placeholder="Street, Landmark"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={address.pincode}
                      onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))}
                      placeholder="400001"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-card p-4 sticky top-20">
              <h2 className="font-semibold mb-4">Price Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-secondary">FREE</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="hero"
                size="lg"
                className="w-full mt-4"
                onClick={() => setShowPayment(true)}
              >
                Proceed to Pay
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                🔒 Secure checkout • 100% safe payment
              </p>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        amount={total}
      />
    </Layout>
  );
}
