<h1 align="center">Conca D'oro - Full-Stack Restaurant Management Platform</h1>

<div align="center">
  A premium, highly-scalable, production-ready SaaS solution designed for seamless restaurant operations, ordering, and menu management.
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16.0-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-5.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br />

## Project Overview

Conca D'oro is a full-featured, commercial-grade web platform engineered to digitize restaurant workflows. Built from the ground up with a modern tech stack (Next.js App Router, TypeScript, PostgreSQL), it bridges the gap between end-users placing orders and administrators managing complex menus, orders, and operational histories. 

This platform prioritizes clean architecture, type safety, and real-time state management, providing a highly responsive layout (RTL-first) suitable for Arabic-speaking demographics, while remaining extensible for multilingual support.

## Live Demo

**Experience the production environment:** [Conca D'oro Live Deployment](https://conca-doro-restaurant.vercel.app/)

---

## Key Features

- **Dynamic Interactive Menu:** High-performance, SEO-friendly menu rendering with hierarchical categories and product variants.
- **Robust Authentication Flow:** Secure JWT-based session handling via NextAuth.js, supporting distinct role-based access control (RBAC) for `USER` and `ADMIN`.
- **Advanced Admin Dashboard:** Comprehensive back-office capabilities including live order tracking, menu manager, and historical data analytics.
- **Persistent Cart State:** Fluid e-commerce experience using React Context API for frictionless add-to-cart, checkout, and state persistence.
- **Secure Image Management:** Integrated with Cloudinary for optimized, on-the-fly image transformations and cloud storage.
- **End-to-End Type Safety:** Strict TypeScript configurations paired with Prisma ORM ensuring reliable data mutations and eliminating runtime type errors.

---

## Technical Architecture Overview

The system follows a modern monolithic architecture utilizing Next.js as a full-stack framework. 

- **Frontend layer:** Server Components (RSC) and Client Components are mixed strategically. RSC is used for initial data fetching and SEO, while Client Components manage interactivity (Cart, Modals, Forms).
- **API layer:** Next.js API Routes handle decoupled logic, integrated directly with Prisma Client to interact with the PostgreSQL database.
- **Middleware:** Next.js Edge Middleware dynamically protects `/admin` routes, verifying user JWT claims before rendering protected payloads.
- **Database layer:** PostgreSQL, heavily structured around relational paradigms (Users, Orders, Categories, Products, Variants) optimized via Prisma migrations.

---

## Tech Stack Breakdown

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Framework** | Next.js (App Router) | Full-stack React framework, SSR/SSG, API Routes |
| **Language** | TypeScript | Static typing, interface definitions, bug reduction |
| **Styling** | Tailwind CSS v4 | Utility-first, responsive, and maintainable styling |
| **Database** | PostgreSQL | Relational data persistence, robust querying |
| **ORM** | Prisma | Schema management, type-safe database access |
| **Authentication**| NextAuth.js | Session management, hashing (bcryptjs), secure cookies |
| **Cloud Media** | Cloudinary | Asset delivery network, image optimization |
| **Icons & UI** | Lucide React / Hot Toast| Vector icons and non-blocking toast notifications |

---

## Folder Structure

```text
├── app/                  # Next.js 14+ App Router root
│   ├── admin/            # Protected admin dashboard pages & layouts
│   ├── api/              # Backend API routes (auth, orders, menu)
│   ├── checkout/         # Secure checkout workflow
│   ├── menu/             # Customer-facing menu and product pages
│   ├── my-orders/        # Authenticated user order history
│   └── layout.tsx        # Global application layout and context providers
├── components/           # Reusable UI components (CartSidebar, CategoryNav)
├── context/              # React Context providers (CartContext)
├── lib/                  # Utility functions and shared instances (Prisma client)
├── prisma/               # Database schemas, migrations, and seed scripts
│   ├── schema.prisma     # Relational database models
│   └── seed.ts           # Initial DB population script
├── public/               # Static assets and icons
└── types/                # Global TypeScript type definitions
```

---

## Installation Guide

Follow these instructions to run the platform locally.

**Prerequisites:** Node.js (v20+), npm/yarn, and a running PostgreSQL instance.

```bash
# 1. Clone the repository
git clone https://github.com/Mostafa-K-Fakhry/conca-doro-system.git

# 2. Navigate into the directory
cd conca-doro-system

# 3. Install dependencies
npm install
```

---

## Environment Variables Setup

Create a `.env` file in the root directory. You will need to provision credentials for PostgreSQL, NextAuth, and Cloudinary.

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/concadoro?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_super_secret_string_for_jwt_encryption"

# Cloudinary (Media Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

## Prisma & Database Setup

Initialize the database schema and populate it with initial data.

```bash
# Generate Prisma Client based on schema.prisma
npx prisma generate

# Push the schema to your database (for local development)
npx prisma db push

# Seed the database with initial admin user and sample menu items
npm run prisma db seed
```

---

## Development Workflow

To start the local development server with hot-reloading enabled:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`. 
API requests will be routed through `http://localhost:3000/api`.

---

## Production Deployment Guide

This project is optimized for deployment on Vercel. 

1. Push your code to a GitHub repository.
2. Import the project into your Vercel dashboard.
3. Configure the environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.) in the Vercel project settings.
4. Vercel will automatically detect Next.js and run the build command:
   ```bash
   npx prisma generate && next build
   ```
5. Production builds are aggressively optimized, generating static HTML where possible and heavily caching API responses.

---

## Authentication & Security

- **Edge Protection:** Next.js Middleware intercepts requests to `/admin/*`, validating JWT tokens before server execution, preventing unauthorized data fetching.
- **Password Hashing:** Passwords are mathematically hashed via `bcryptjs` before database insertion.
- **Session Strategy:** Stateless JWT approach via NextAuth.js guarantees minimal database overhead for session validation.
- **Route Handlers:** API routes utilize session verification checks (`getServerSession`) to protect against unauthenticated POST/PUT/DELETE mutations.

---

## API & Routes Overview

The application utilizes internal API routes to decouple frontend components from direct database queries:

- `POST /api/auth/[...nextauth]` - Manages login/logout lifecycles and credential verification.
- `GET/POST /api/menu` - Fetches and mutates category and product structures.
- `GET/POST /api/orders` - Handles checkout submissions, calculates total amounts, and retrieves user-specific order histories.
- `PUT /api/admin/orders` - Exclusively for `ADMIN` roles to update order fulfillment statuses.

---

## Performance Optimization Notes

- **Image Optimization:** Utilizes `next-cloudinary` and Next.js `<Image />` component for WebP conversion, lazy loading, and dynamic resizing based on viewport.
- **Font Optimization:** Google Fonts (`Cairo`) are subsetted and preloaded at the build stage via `next/font`, preventing CLS (Cumulative Layout Shift) and FOUT.
- **RSC Payload Reduction:** Heavy context providers (like Cart) are pushed down the component tree strictly to client components, keeping the parent layout statically renderable.

---

## Scalability Considerations

- **Database Scaling:** Prisma accelerates horizontal scaling configurations via connection pooling (`PgBouncer` compatibility).
- **Stateless Architecture:** JWT-based authentication allows backend instances to scale infinitely without sticky sessions.
- **Variant Handling:** The relational schema (`Product` -> `ProductVariant`) allows for massive menu expansion without duplicating core product metadata.

---

## Responsive Design & Mobile Optimization

- **Tailwind Media Queries:** Employs a mobile-first design strategy, scaling seamlessly from 320px screens up to ultra-wide 4K monitors.
- **Touch-Friendly UI:** Navigation drawers, cart sidebars, and checkout flows are designed with large touch targets, swipe interactions, and readable typography for mobile users.
- **RTL Support:** Complete bidirectional logic handles Arabic UI/UX natively, ensuring proper alignment, padding, and semantic flow.

---

## SEO Considerations

- **Server-Side Rendering:** Product pages and categories are rendered on the server, injecting vital HTML immediately for web crawlers.
- **Semantic HTML:** Utilizes modern `<nav>`, `<main>`, `<section>`, and `<article>` tags.
- **Dynamic Metadata:** Next.js Metadata API is implemented in `layout.tsx` and specific page levels for accurate `<title>` and `<meta name="description">` tags.

---

## Future Improvements Roadmap

- [ ] **Payment Gateway Integration:** Implement Stripe or Paymob for processing credit card transactions.
- [ ] **Real-Time WebSockets:** Migrate admin order polling to Server-Sent Events (SSE) or WebSockets for instantaneous kitchen displays.
- [ ] **Multi-Language (i18n):** Introduce full English UI localization alongside the existing Arabic support.
- [ ] **Automated Testing:** Implement Jest for unit testing API routes and Playwright for E2E user flow validation.

---

## Contributing Guide

We welcome contributions from open-source developers. To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Author

**Mostafa K. Fakhry**  
*Full-Stack Software Engineer*

---

## Connect With Me

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mostafa-K-Fakhry)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/)  
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://your-portfolio-link.com/)  

---

<div align="center">
  <i>Engineered with clean code, scalability, and modern web standards.</i>
</div>
