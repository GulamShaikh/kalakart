# KalaKart - Handmade Festival Décor Marketplace

## About

**KalaKart** is a marketplace connecting local artisans specializing in traditional Indian handicrafts with customers seeking authentic handcrafted festival decorations. From torans to rangoli to complete festival décor, KalaKart brings skilled home artists directly to your doorstep.

## Features

- 🎨 **Artisan Marketplace**: Browse and book local artists for handcrafted decorations
- 🏠 **Home Visit & Digital**: Choose between in-person services or shipped products
- 📅 **Scheduling**: Book services with date and time selection
- 🛒 **Shopping Cart**: Add multiple items with customization options
- 💰 **Secure Checkout**: Demo payment gateway integration
- 👤 **Dual Roles**: Customer and Artist dashboards
- 📊 **Artist Analytics**: Earnings tracking, order management, and payout requests
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

This project is built with:

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **shadcn-ui** - High-quality UI components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or use Bun)
- Git

### Installation

```sh
# Clone the repository
git clone https://github.com/GulamShaikh/kalakart-marketplace.git

# Navigate to the project directory
cd kalakart-marketplace

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080` (or the next available port).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Demo Accounts

For testing purposes, use these credentials:

**Customer Account:**

- Email: `customer@kalaghar.demo`
- Password: `Demo1234!`

**Artist Account:**

- Email: `artist@kalaghar.demo`
- Password: `Artist1234!`

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, BottomNav, Layout wrapper
│   ├── products/        # Product and category cards
│   ├── checkout/        # Payment modal
│   └── ui/             # shadcn-ui components
├── contexts/           # React Context providers (Auth, Cart, Orders)
├── pages/             # Route components
├── data/              # Demo data (editable JSON)
├── hooks/             # Custom React hooks
└── lib/               # Utility functions
```

## Customization Guide

### Update Product Catalog

Edit `src/data/demo-data.json` to:

- Add/remove products
- Update prices, images, and descriptions
- Modify categories
- Adjust artist profiles

### Change Images

Replace image URLs in `demo-data.json` with your own. You can use:

- Local images in the `public/` folder
- External CDN links (Unsplash, Cloudinary, etc.)
- Your own hosted images

### Adjust Styling

- **Colors**: Modify CSS variables in `src/index.css`
- **Fonts**: Update font imports in `src/index.css`
- **Components**: Edit shadcn-ui components in `src/components/ui/`
- **Tailwind**: Customize `tailwind.config.ts`

### Backend Integration

The app currently uses localStorage for demo purposes. To connect a backend:

1. Replace Context API calls in `src/contexts/` with API endpoints
2. Add authentication service (JWT, OAuth, etc.)
3. Implement payment gateway integration
4. Add image upload for artist profiles and products

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import repository
4. Deploy (auto-detects Vite configuration)

### Netlify

1. Push code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Connect repository
4. Deploy

### Manual Build

```sh
npm run build
```

Deploy the `dist/` folder to any static hosting service.

## Roadmap

- [ ] Backend API integration
- [ ] Real payment gateway (Razorpay, Stripe)
- [ ] Image upload functionality
- [ ] SMS/Email notifications
- [ ] Artist verification system
- [ ] Advanced search and filters
- [ ] Review and rating system
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support:

- Email: gulamshaikh2455@gmail.com
- GitHub: [@GulamShaikh](https://github.com/GulamShaikh)

---

Built with ❤️ for preserving traditional Indian art and supporting local artisans.
