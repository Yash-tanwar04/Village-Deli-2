import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ScrollToTop } from './components/ScrollToTop';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { WhatWeOfferPage } from './pages/WhatWeOfferPage';
import { FormatsPage } from './pages/FormatsPage';
import { SourcePage } from './pages/SourcePage';
import { LocationsPage } from './pages/LocationsPage';
import { OrderNowPage } from './pages/OrderNowPage';
import { CategoryProductsPage } from './pages/CategoryProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ClubPage } from './pages/ClubPage';
import { HubPage } from './pages/HubPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyAccountPage } from './pages/MyAccountPage';

// Corporate Franchise Chapters
import { ExperiencePage } from './pages/ExperiencePage';
import { OpportunityPage } from './pages/OpportunityPage';
import { BrandsPage } from './pages/BrandsPage';
import { InvestmentPage } from './pages/InvestmentPage';
import { ExpansionPage } from './pages/ExpansionPage';

// Admin Console Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminAdmins } from './pages/admin/AdminAdmins';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminTransactions } from './pages/admin/AdminTransactions';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminQueries } from './pages/admin/AdminQueries';
import { AdminStores } from './pages/admin/AdminStores';
import { Navigate } from 'react-router-dom';

// Layout wrapper for customer-facing store pages
const CustomerStoreLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 font-sans antialiased overflow-x-hidden flex flex-col justify-between selection:bg-[#6cb33f] selection:text-white">
      <Header />
      <CartDrawer />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* 1. Customer Storefront Routes */}
            <Route element={<CustomerStoreLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/what-we-offer" element={<WhatWeOfferPage />} />
              <Route path="/formats" element={<FormatsPage />} />
              <Route path="/source" element={<SourcePage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/order-now" element={<OrderNowPage />} />
              <Route path="/category/:slug" element={<CategoryProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
              <Route path="/order-tracking" element={<OrderTrackingPage />} />
              <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />
              <Route path="/club" element={<ClubPage />} />
              <Route path="/hub" element={<HubPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/my-account" element={<MyAccountPage />} />
              <Route path="/my-orders" element={<MyAccountPage />} />
              <Route path="/profile" element={<MyAccountPage />} />
              <Route path="/my-profile" element={<MyAccountPage />} />

              {/* Corporate Franchise & Partnership Chapters */}
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/opportunity" element={<OpportunityPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/investment" element={<InvestmentPage />} />
              <Route path="/expansion" element={<ExpansionPage />} />
            </Route>

            {/* 2. Standalone Admin Authentication Portal */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

            {/* 3. Protected Admin Management Console Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="queries" element={<AdminQueries />} />
              <Route path="locations" element={<AdminStores />} />
              <Route path="stores" element={<AdminStores />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="admins" element={<AdminAdmins />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
