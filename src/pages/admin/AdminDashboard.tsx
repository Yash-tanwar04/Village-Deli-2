import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Plus,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../../lib/api';
import { Order, Product, OrderStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    active_products: 0,
    total_customers: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      setStats(data.stats);
      setRecentOrders(data.recent_orders || []);
      setLowStockProducts(data.low_stock_products || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
          Loading Store Overview...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
            Store Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time analytics, inventory management, and customer order fulfillment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-4 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#fed100]" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-bold px-4 py-2.5 rounded-full transition-colors"
          >
            <span>Fulfillment Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </Link>
        </div>
      </div>

      {/* 1. METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total COD Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#3b711e] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 font-serif">₹{stats.total_revenue}</div>
          <p className="text-[11px] text-stone-500">Collected & pending delivery</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 font-serif">{stats.total_orders}</div>
          <p className="text-[11px] text-stone-500">Lifetime customer orders</p>
        </div>

        {/* Catalog Products */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Active Products</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 font-serif">{stats.active_products}</div>
          <p className="text-[11px] text-stone-500">
            {stats.active_products === 0 ? 'Zero Demo Products (Empty)' : 'Published in store'}
          </p>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Registered Customers</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 font-serif">{stats.total_customers}</div>
          <p className="text-[11px] text-stone-500">Active customer profiles</p>
        </div>
      </div>

      {/* 2. RECENT ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 font-serif">
              Recent Orders
            </h2>
            <p className="text-xs text-stone-500">Immediate fulfillment queue</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#3b711e] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Delivery PIN</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total (COD)</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.slice(0, 6).map(order => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      #{order.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{order.customer_name}</div>
                      <div className="text-[10px] text-stone-400">{order.customer_phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {order.delivery_address.pincode}
                    </td>
                    <td className="py-3 px-4">
                      {order.items.length} items
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      ₹{order.total}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={e => handleQuickStatusChange(order.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                          order.status === 'Delivered'
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : order.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-[#f2f6ee] text-[#2d5c16] border-[#6cb33f]/30'
                        }`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        target="_blank"
                        className="text-stone-400 hover:text-stone-800 p-1 inline-block"
                        title="View Receipt"
                      >
                        <ExternalLink className="w-4 h-4 inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stone-500">
            No customer orders placed yet. Orders created on the storefront will appear here instantly.
          </div>
        )}
      </div>

      {/* 3. LOW STOCK WARNING TABLE */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-serif">
              Low Stock Alerts ({lowStockProducts.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map(p => (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-xs text-stone-900 truncate">{p.name}</div>
                  <div className="text-[10px] text-stone-500">SKU: {p.sku}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {p.stock_quantity} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
