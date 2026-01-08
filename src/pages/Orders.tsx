import { Link } from 'react-router-dom';
import { Package, Calendar, MapPin, Mail, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { cn } from '@/lib/utils';

export default function Orders() {
  const { user } = useAuth();
  const { getCustomerOrders, getArtistOrders } = useOrders();

  if (!user) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display font-bold text-xl">View Your Orders</h1>
          <p className="text-muted-foreground mt-2">Please login to see your order history</p>
          <Link to="/login">
            <Button className="mt-4">Login</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const orders = user.role === 'artist' ? getArtistOrders(user.id) : getCustomerOrders(user.id);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    scheduled: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Layout>
      <div className="container px-4 py-4">
        <h1 className="font-display font-bold text-2xl mb-6">
          {user.role === 'artist' ? 'Incoming Orders' : 'My Orders'}
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display font-semibold text-lg">No orders yet</h2>
            <p className="text-muted-foreground mt-1">
              {user.role === 'artist'
                ? 'Orders from customers will appear here'
                : 'Start shopping to see your orders here'}
            </p>
            {user.role !== 'artist' && (
              <Link to="/explore">
                <Button className="mt-4">Browse Products</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card rounded-xl shadow-card p-4">
                <div className="flex gap-4">
                  <img
                    src={order.productImage}
                    alt={order.productTitle}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium line-clamp-2">{order.productTitle}</h3>
                      <Badge className={cn("shrink-0 capitalize", statusColors[order.status])}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center">
                        {order.serviceType === 'home-visit' ? (
                          <>
                            <MapPin className="w-3 h-3 mr-1" />
                            Home Visit
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 mr-1" />
                            Digital
                          </>
                        )}
                      </span>
                      {order.scheduledDate && (
                        <span className="inline-flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(order.scheduledDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}
                      {order.scheduledTime && (
                        <span className="inline-flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {order.scheduledTime}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="font-mono text-xs">{order.id}</p>
                      </div>
                      <p className="font-semibold text-primary">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Artist actions */}
                {user.role === 'artist' && order.status === 'confirmed' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button size="sm" variant="success" className="flex-1">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
