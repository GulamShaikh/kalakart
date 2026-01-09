import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-gradient">
              KalaKart
            </h3>
            <p className="text-sm text-muted-foreground">
              Connecting local artisans with customers for authentic handcrafted
              festival décor and traditional art.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/explore"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Explore Artists
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Become an Artist
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/explore?category=rangoli"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Rangoli Designs
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=toran"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Torans
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=festival-decor"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Festival Décor
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=pooja-kits"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pooja Kits
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=custom-items"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Custom Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <a
                  href="mailto:support@kalakart.com"
                  className="hover:text-foreground transition-colors"
                >
                  support@kalakart.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-foreground transition-colors"
                >
                  +91 93721 94085
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} KalaKart by GD. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/refund"
              className="hover:text-foreground transition-colors"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
