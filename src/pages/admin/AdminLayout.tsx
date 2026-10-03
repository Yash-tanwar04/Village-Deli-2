import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  Store,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Clock,
  MessageSquareQuote,
  Receipt,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isSuperAdmin, logout, isLoading } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Transactions & Gateway', path: '/admin/transactions', icon: Receipt },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Customer Queries', path: '/admin/queries', icon: LifeBuoy },
    { label: 'Store Locations', path: '/admin/locations', icon: Store },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Admins', path: '/admin/admins', icon: ShieldCheck },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07130c] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-stone-600 border-t-[#6cb33f] rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated at all -> Redirect to Admin Login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated as Customer -> Display Access Denied (Requirement 4 & 29)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#07130c] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0d1f15] border border-red-900/60 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-black text-white mb-2">
            ACCESS DENIED
          </h2>
          <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold mb-3">
            403 Unauthorized Access
          </div>
          <p className="text-xs text-stone-400 mb-6 leading-relaxed">
            You are signed in as <strong className="text-stone-200">{user.email}</strong>, which does not have store administration privileges. Customer accounts cannot access the VillageDELI Administration Console.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              to="/admin/login"
              onClick={() => logout()}
              className="bg-[#6cb33f] hover:bg-[#7ad048] text-[#0d1f15] py-3 rounded-full text-xs font-black uppercase tracking-wider transition-colors"
            >
              Sign In with Admin Account
            </Link>
            <Link
              to="/"
              className="bg-white/10 hover:bg-white/15 text-stone-300 py-3 rounded-full text-xs font-bold transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f2] text-stone-900 flex flex-col pt-16">
      {/* TOP ADMIN HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0d1f15] text-white border-b border-stone-800 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#6cb33f] text-[#0d1f15] font-black flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-black tracking-tight text-white text-lg">VillageDELI</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#fed100] ml-2 bg-[#fed100]/20 px-2 py-0.5 rounded-full border border-[#fed100]/30">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/order-now"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#6cb33f]" />
            <span>View Public Storefront</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-white/10 text-xs">
            <div className="w-7 h-7 rounded-full bg-[#3b711e] text-white font-bold flex items-center justify-center text-xs">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="font-semibold text-xs leading-tight">{user.full_name || 'Administrator'}</span>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#fed100]">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200/90 p-4 space-y-6 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-3">
              Store Management
            </span>
            <nav className="space-y-1 pt-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0d1f15] text-white shadow-xs font-bold'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#fed100]' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-stone-100 mt-auto">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-[11px] space-y-1">
              <div className="font-bold text-stone-800">24/7 Live Store Operations</div>
              <div className="text-[10px] text-stone-500">Fast COD fulfillment pipeline active</div>
            </div>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="bg-white w-64 h-full p-4 flex flex-col space-y-4 animate-slideRight"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-serif font-black text-sm text-[#0d1f15]">
                  Admin Navigation
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/admin'
                      ? location.pathname === '/admin'
                      : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#0d1f15] text-white font-bold'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#fed100]' : 'text-stone-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-stone-200 mt-auto">
                <button
                  onClick={() => {
                    logout();
                    navigate('/admin/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN OUTLET PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
