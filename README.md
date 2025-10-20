# Slick - Premium Streetwear E-commerce Store

A modern, full-stack e-commerce platform built with Next.js 15, Tailwind CSS, and Supabase. Specializing in premium streetwear shoes with a sleek, responsive design.

## 🚀 Features

### Storefront
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Product Catalog**: Browse and filter premium streetwear shoes
- **Product Details**: Detailed product pages with image galleries
- **Shopping Cart**: Persistent cart with local storage
- **User Authentication**: Secure sign-up, sign-in, and profile management
- **Password Recovery**: Forgot password and password reset functionality
- **Profile Management**: Edit user information and upload profile pictures

### Admin Dashboard
- **Dashboard Analytics**: Real-time stats and metrics
- **Product Management**: Create, edit, and delete products
- **Stock Management**: Manage product variants and inventory
- **Order Management**: View and manage customer orders
- **User Management**: Admin user role management
- **Real-time Updates**: Live dashboard with current time

### Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Supabase**: Database, authentication, and storage
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Role-Based Access Control**: Admin and user permissions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/slick-store.git
   cd slick-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Set up Row Level Security (RLS) policies
   - Configure authentication settings

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following main tables:

- **products**: Product information and details
- **product_variants**: Size and stock information
- **orders**: Customer orders
- **order_items**: Individual order line items
- **profiles**: User profile information
- **admin_users**: Admin user roles and permissions

## 🔐 Authentication & Authorization

- **User Authentication**: Supabase Auth with email/password
- **Admin Access**: Role-based access control
- **Password Recovery**: Email-based password reset
- **Profile Management**: User can edit their information

## 🎨 Design System

- **Color Palette**: Modern grays with accent colors
- **Typography**: Inter font family
- **Components**: Reusable, accessible components
- **Responsive**: Mobile-first design approach

## 📱 Pages & Routes

### Public Routes
- `/` - Homepage
- `/products` - Product catalog
- `/products/[slug]` - Product details
- `/cart` - Shopping cart
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password recovery
- `/update-password` - Password reset
- `/profile` - User profile

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/products/new` - Create product
- `/admin/products/edit/[id]` - Edit product
- `/admin/orders` - Order management
- `/admin/users` - User management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Static site generation
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure
```
slick-store/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin route group
│   ├── products/          # Product pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── context/              # React contexts
├── lib/                  # Utility functions
├── middleware.ts         # Next.js middleware
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Vercel](https://vercel.com/) for the deployment platform

## 📞 Support

If you have any questions or need help, please open an issue or contact us.

---

**Built with ❤️ for the streetwear community**