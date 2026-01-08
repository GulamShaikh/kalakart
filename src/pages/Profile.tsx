import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronRight, Star, Package, MapPin, Globe, Shield } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  if (!user) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display font-bold text-xl">Your Profile</h1>
          <p className="text-muted-foreground mt-2">Please login to view your profile</p>
          <Link to="/login">
            <Button className="mt-4">Login / Sign Up</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
    toast({ title: "Profile updated! ✨" });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({ title: "Logged out successfully" });
  };

  return (
    <Layout>
      <div className="container px-4 py-4 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-card rounded-xl shadow-card p-4 mb-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl">{user.name}</h1>
                {user.verified && (
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              {user.role === 'artist' && user.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{user.rating}</span>
                  <span className="text-sm text-muted-foreground">({user.totalOrders} orders)</span>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {user.bio && !isEditing && (
            <p className="text-sm text-muted-foreground mt-4">{user.bio}</p>
          )}

          {isEditing && (
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editData.name}
                  onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editData.phone}
                  onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))}
                />
              </div>
              {user.role === 'artist' && (
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={editData.bio}
                    onChange={e => setEditData(d => ({ ...d, bio: e.target.value }))}
                  />
                </div>
              )}
              <Button onClick={handleSave} className="w-full">Save Changes</Button>
            </div>
          )}
        </div>

        {/* Artist Stats */}
        {user.role === 'artist' && (
          <div className="bg-card rounded-xl shadow-card p-4 mb-4">
            <h2 className="font-semibold mb-3">Earnings Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-display font-bold text-primary">₹{(user.earnings || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-display font-bold text-secondary">₹{(user.pendingPayout || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Pending Payout</p>
              </div>
            </div>
            {(user.pendingPayout || 0) > 0 && (
              <Button variant="success" className="w-full mt-4">
                Request Payout
              </Button>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden mb-4">
          {user.role === 'artist' && (
            <Link
              to="/artist/dashboard"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Artist Dashboard</p>
                  <p className="text-xs text-muted-foreground">Manage listings & orders</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          )}
          <Link
            to="/orders"
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium">My Orders</p>
                <p className="text-xs text-muted-foreground">View order history</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
          {user.address && (
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium">Saved Address</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {user.address.line1}, {user.address.city}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-card rounded-xl shadow-card p-4 mb-4">
          <h2 className="font-semibold mb-3">Contact Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span>{user.phone}</span>
            </div>
            {user.languages && user.languages.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Languages</span>
                <span>{user.languages.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </Layout>
  );
}
