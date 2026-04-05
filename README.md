# ShopNest - Next.js First Project

A modern e-commerce application built with Next.js, featuring a complete shopping experience with product catalog, cart management, checkout, and user authentication.

## Project Features

- 🛍️ Product browsing and filtering
- 🛒 Shopping cart management with Redux
- ❤️ Wishlist functionality
- 🔐 User authentication (Sign in, Sign up, Forgot password)
- 👤 User account management
- 📦 Order tracking
- 💳 Checkout process
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** SCSS
- **State Management:** Redux
- **Language:** JavaScript

## Project Structure

```
shopnest/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Redux store and slices
│   ├── styles/           # Global styles
│   └── utils/            # Helper functions and API utilities
├── public/               # Static assets
└── package.json          # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shopnest
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Development Workflow

- Main branch: `main` - Production-ready code
- Development branch: `develop` - Integration branch for features
- Feature branches: `feature/*` - Individual feature development

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Commit with clear, descriptive messages
4. Push to your branch
5. Create a Pull Request

## License

MIT
