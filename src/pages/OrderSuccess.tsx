import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Home, Package, MessageCircle, Share2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('txn') || 'TXN-DEMO-0001';
  const { orders } = useOrders();
  const { user } = useAuth();

  // Get the latest order
  const latestOrder = orders.find(o => o.transactionId === transactionId);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My KalaKart Order',
        text: `I just ordered beautiful handmade art from KalaKart! Order ID: ${latestOrder?.id}`,
        url: window.location.origin,
      });
    }
  };

  return (
    <Layout hideNav>
      <div className="container px-4 py-8 max-w-lg mx-auto text-center">
        <div className="animate-bounce-soft">
          <div className="w-24 h-24 mx-auto gradient-success rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-secondary-foreground" />
          </div>
        </div>

        <h1 className="font-display font-bold text-2xl md:text-3xl mb-2 animate-fade-in">
          Order Confirmed! 🎉
        </h1>
        <p className="text-muted-foreground animate-fade-in">
          Thank you for supporting local artisans
        </p>

        {/* Order Details */}
        <div className="bg-card rounded-xl shadow-card p-4 mt-6 text-left animate-slide-up">
          {latestOrder && (
            <>
              <div className="flex gap-4 pb-4 border-b border-border">
                <img
                  src={latestOrder.productImage}
                  alt={latestOrder.productTitle}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium">{latestOrder.productTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {latestOrder.serviceType === 'home-visit' ? '🏠 Home Visit' : '📧 Digital Delivery'}
                  </p>
                  {latestOrder.scheduledDate && (
                    <p className="text-sm text-muted-foreground">
                      📅 {new Date(latestOrder.scheduledDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })} at {latestOrder.scheduledTime}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-medium">{latestOrder?.id || 'ORD-2024-001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono font-medium text-primary">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1 text-secondary font-medium">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                Confirmed
              </span>
            </div>
            {latestOrder && (
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-medium">Total Paid</span>
                <span className="font-bold text-primary">₹{latestOrder.total.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-muted/50 rounded-xl p-4 mt-4 text-left">
          <p className="text-sm text-muted-foreground">
            {latestOrder?.serviceType === 'home-visit'
              ? `🏠 Our artist will visit on ${latestOrder.scheduledDate ? new Date(latestOrder.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : 'the scheduled date'}`
              : '📦 Your order will be delivered within the lead time mentioned'}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Link to="/orders">
            <Button variant="outline" className="w-full gap-2">
              <Package className="w-4 h-4" />
              View Orders
            </Button>
          </Link>
        </div>

        <Link to="/">
          <Button variant="hero" size="lg" className="w-full mt-4 gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        {/* Message Artist */}
        <button className="flex items-center justify-center gap-2 w-full mt-4 text-sm text-primary font-medium hover:underline">
          <MessageCircle className="w-4 h-4" />
          Message Artist
        </button>
      </div>
    </Layout>
  );
}
