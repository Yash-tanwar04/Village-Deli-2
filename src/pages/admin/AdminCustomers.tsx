import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Calendar,
  X,
  Eye,
  ExternalLink,
  Phone,
  Mail,
  PackageCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../../lib/api';
import { Order } from '../../types';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Pagination State (Requirement 1)
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selected customer for details modal (Requirement 9)
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Selected order to inspect from order history
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const filtered = customers.filter(
    c =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedCustomers = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15] flex items-center gap-2.5">
            <span>Customer Directory</span>
            <span className="text-xs font-sans font-bold bg-[#fed100]/20 text-[#0d1f15] border border-[#fed100]/40 px-2.5 py-0.5 rounded-full">
              {customers.length} Profiles
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real customer spending records, synchronized order histories, and purchase analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold bg-white border border-stone-200 px-3 py-2 rounded-xl shadow-2xs">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-0.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#3b711e]"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page</span>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] bg-white shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-bold uppercase">Loading customer profiles...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-100">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Orders Placed</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Avg Order Value</th>
                  <th className="py-3.5 px-4">Latest Order</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedCustomers.map(c => {
                  const ordersCount = c.order_count ?? c.orders_count ?? 0;
                  const totalSpent = c.total_spent ?? 0;
                  const avgVal = ordersCount > 0 ? Math.round(totalSpent / ordersCount) : 0;

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 font-bold text-stone-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#3b711e]/10 text-[#3b711e] font-black flex items-center justify-center text-xs">
                            {c.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="group-hover:text-[#3b711e] transition-colors">
                              {c.full_name}
                            </span>
                            <div className="text-[10px] text-stone-400 font-normal">
                              Member since {new Date(c.joined_date || c.created_at || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-mono text-stone-800">{c.email}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{c.phone || 'No phone'}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 font-bold text-xs ${
                          ordersCount > 0 ? 'text-[#3b711e]' : 'text-stone-400'
                        }`}>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{ordersCount} {ordersCount === 1 ? 'order' : 'orders'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 font-black text-stone-900 text-sm">
                        ₹{totalSpent.toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-4 font-semibold text-stone-700">
                        ₹{avgVal.toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-4">
                        {c.last_order_id ? (
                          <div>
                            <span className="font-mono font-bold text-stone-800 text-xs">
                              {c.last_order_id}
                            </span>
                            <div className="text-[10px] text-stone-400">
                              {new Date(c.last_order_date).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">No orders yet</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedCustomer(c);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-[#3b711e] hover:text-[#0d1f15] bg-[#3b711e]/10 hover:bg-[#3b711e]/20 px-3 py-1.5 rounded-lg font-bold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-stone-500">
            No customer accounts found matching your search.
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && filtered.length > 0 && (
          <div className="p-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div>
              Showing <span className="font-bold text-stone-800">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-bold text-stone-800">
                {Math.min(currentPage * pageSize, filtered.length)}
              </span>{' '}
              of <span className="font-bold text-stone-800">{filtered.length}</span> customers
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
                  let pageNum = idx + 1;
                  if (totalPages > 7) {
                    if (currentPage <= 4) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + idx;
                    } else {
                      pageNum = currentPage - 3 + idx;
                    }
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#0d1f15] text-white shadow-2xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CUSTOMER DETAILS MODAL (Requirement 9) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-stone-200 relative">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-5 top-5 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <div className="w-12 h-12 rounded-2xl bg-[#0d1f15] text-[#fed100] flex items-center justify-center font-bold text-lg font-serif">
                {selectedCustomer.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#3b711e]">
                  Customer Account Dossier
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0d1f15]">
                  {selectedCustomer.full_name}
                </h2>
              </div>
            </div>

            {/* Section 1: Customer Profile Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Email Address
                </span>
                <div className="font-mono text-xs font-semibold text-stone-900 break-all flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{selectedCustomer.email}</span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Contact Phone
                </span>
                <div className="font-mono text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{selectedCustomer.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Registration Date
                </span>
                <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    {new Date(selectedCustomer.joined_date || selectedCustomer.created_at || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="p-4 bg-[#f8faf6] border border-[#d6e5cf] rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3b711e] block">
                  Total Orders
                </span>
                <div className="text-2xl font-black text-[#0d1f15] mt-1">
                  {selectedCustomer.order_count ?? selectedCustomer.orders_count ?? 0}
                </div>
              </div>

              <div className="p-4 bg-[#f8faf6] border border-[#d6e5cf] rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3b711e] block">
                  Total Amount Spent
                </span>
                <div className="text-2xl font-black text-[#0d1f15] mt-1">
                  ₹{(selectedCustomer.total_spent ?? 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 bg-[#f8faf6] border border-[#d6e5cf] rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3b711e] block">
                  Avg Order Value
                </span>
                <div className="text-2xl font-black text-[#0d1f15] mt-1">
                  ₹{(selectedCustomer.average_order_value ?? 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 bg-[#f8faf6] border border-[#d6e5cf] rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3b711e] block">
                  Last Order
                </span>
                <div className="text-base font-black text-[#0d1f15] mt-1 font-mono">
                  {selectedCustomer.last_order_id || 'None'}
                </div>
              </div>
            </div>

            {/* Section 3: Customer Order History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-black text-lg text-[#0d1f15] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#3b711e]" />
                  <span>Customer Order History</span>
                </h3>
                <span className="text-xs text-stone-500">
                  {(selectedCustomer.orders || []).length} Recorded Purchases
                </span>
              </div>

              {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                <div className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-100 text-stone-600 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Payment</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {selectedCustomer.orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-white transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-stone-900">
                            {order.id}
                          </td>
                          <td className="py-3 px-3 text-stone-500">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-3 font-bold text-stone-900">
                            ₹{order.total_amount || order.total}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                              {order.payment_method}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.order_status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.order_status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-[#0d1f15] text-[#fed100]'
                            }`}>
                              {order.order_status || order.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setInspectedOrder(order)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3b711e] hover:text-[#0d1f15] bg-white hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              <span>VIEW ORDER</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                  This customer has not placed any orders yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INSPECT ORDER MODAL (From [VIEW ORDER] in Customer History) */}
      {inspectedOrder && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 border border-stone-200 relative animate-scaleUp">
            <button
              onClick={() => setInspectedOrder(null)}
              className="absolute right-5 top-5 p-1 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-[#0d1f15] text-[#fed100] flex items-center justify-center font-bold">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-[#0d1f15]">
                  Order #{inspectedOrder.id}
                </h3>
                <span className="text-[11px] text-stone-500">
                  {new Date(inspectedOrder.created_at).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Delivery Status</span>
                  <span className="font-bold text-stone-900">{inspectedOrder.order_status || inspectedOrder.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Payment</span>
                  <span className="font-mono font-bold text-stone-900">{inspectedOrder.payment_method} (₹{inspectedOrder.total_amount || inspectedOrder.total})</span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-stone-800 mb-2 uppercase text-[10px] tracking-wider">Ordered Items</h4>
                <div className="space-y-1.5">
                  {(inspectedOrder.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <div>
                        <div className="font-bold text-stone-900">{item.product_name}</div>
                        <div className="text-[10px] text-stone-400">{item.product_unit || item.unit} × {item.quantity}</div>
                      </div>
                      <div className="font-mono font-bold text-stone-900">
                        ₹{item.subtotal || (item.product_price || 0) * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">Delivery Address</span>
                <p className="text-stone-700 leading-relaxed">
                  {inspectedOrder.delivery_address?.house_flat}, {inspectedOrder.delivery_address?.building_street}, {inspectedOrder.delivery_address?.city} - {inspectedOrder.delivery_address?.pincode}
                </p>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setInspectedOrder(null)}
                  className="bg-[#0d1f15] text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-[#173323] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
