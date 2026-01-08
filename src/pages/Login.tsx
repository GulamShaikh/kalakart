import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'customer' as 'customer' | 'artist',
    bio: '',
    sampleId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast({ title: "Welcome back! 🎉", description: "Successfully logged in" });
          navigate('/');
        } else {
          toast({ title: "Login failed", description: result.error, variant: "destructive" });
        }
      } else {
        const result = await signup(formData);
        if (result.success) {
          toast({ title: "Account created! 🎨", description: "Welcome to KalaKart" });
          navigate(formData.role === 'artist' ? '/artist/dashboard' : '/');
        } else {
          toast({ title: "Signup failed", description: result.error, variant: "destructive" });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type: 'customer' | 'artist') => {
    if (type === 'customer') {
      setFormData(f => ({ ...f, email: 'customer@kalaghar.demo', password: 'Demo1234!' }));
    } else {
      setFormData(f => ({ ...f, email: 'artist@kalaghar.demo', password: 'Artist1234!' }));
    }
  };

  return (
    <Layout hideNav>
      <div className="container px-4 py-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl font-display font-bold text-gradient">KalaKart</span>
          </Link>
          <h1 className="font-display font-bold text-2xl">
            {isLogin ? 'Welcome Back!' : 'Join KalaKart'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isLogin ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 mb-6">
          <p className="text-xs font-medium text-accent-foreground mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Quick Demo Login
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('customer')}
              className="flex-1 text-xs py-2 px-3 bg-card rounded-lg hover:bg-muted transition-colors"
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('artist')}
              className="flex-1 text-xs py-2 px-3 bg-card rounded-lg hover:bg-muted transition-colors"
            >
              🎨 Artist
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Role Selection */}
              <div>
                <Label>I want to</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, role: 'customer' }))}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      formData.role === 'customer'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl">🛍️</span>
                    <p className="font-medium mt-2">Shop</p>
                    <p className="text-xs text-muted-foreground">Buy handmade items</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, role: 'artist' }))}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      formData.role === 'artist'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl">🎨</span>
                    <p className="font-medium mt-2">Sell</p>
                    <p className="text-xs text-muted-foreground">Share your craft</p>
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              {formData.role === 'artist' && (
                <>
                  <div>
                    <Label htmlFor="bio">Short Bio</Label>
                    <Input
                      id="bio"
                      value={formData.bio}
                      onChange={e => setFormData(f => ({ ...f, bio: e.target.value }))}
                      placeholder="Tell us about your craft..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="sampleId">ID Proof (Demo)</Label>
                    <Input
                      id="sampleId"
                      value={formData.sampleId}
                      onChange={e => setFormData(f => ({ ...f, sampleId: e.target.value }))}
                      placeholder="AADHAAR-XXXX-1234"
                    />
                    <p className="text-xs text-muted-foreground mt-1">For verification (demo only)</p>
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <Link to="/" className="block text-center text-sm text-muted-foreground mt-4 hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </Layout>
  );
}
