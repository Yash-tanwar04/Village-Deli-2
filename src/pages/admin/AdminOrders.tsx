import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  X,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Store,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Order, OrderStatus, StoreLocation } from '../../types';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State (Requirement 1)
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');

  // Product Preview Card State (Requirement 4.1)
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const [ordersData, storesData] = await Promise.all([
        api.getOrders(),
        api.getStores(true).catch(() => [])
      ]);
      setOrders(ordersData);
      setStores(storesData);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    setVerifyingPayment(true);
    setVerifyMessage('');
    try {
      const result = await api.verifyOrderPayment(orderId);
      setOrders(prev => prev.map(o => (o.id === orderId ? result.order : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(result.order);
      }
      setVerifyMessage('Payment verified and order automatically confirmed!');
    } catch (err: any) {
      alert(err.message || 'Failed to verify payment');
    } finally {
      setVerifyingPayment(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, paymentFilter, fulfillmentFilter, pageSize]);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;

    let matchesPayment = true;
    if (paymentFilter === 'razorpay') {
      matchesPayment = o.payment_method === 'Razorpay';
    } else if (paymentFilter === 'cod') {
      matchesPayment = o.payment_method === 'COD';
    } else if (paymentFilter === 'needs_verification') {
      matchesPayment = o.payment_method === 'Razorpay' && o.payment_status === 'Paid' && !o.payment_verified_by_admin;
    }

    let matchesFulfillment = true;
    if (fulfillmentFilter === 'pickup') {
      matchesFulfillment = o.delivery_type === 'pickup';
    } else if (fulfillmentFilter === 'delivery') {
      matchesFulfillment = o.delivery_type !== 'pickup';
    } else if (fulfillmentFilter !== 'all') {
      matchesFulfillment = o.pickup_store_id === fulfillmentFilter || o.nearest_store_id === fulfillmentFilter;
    }

    const matchesSearch = searchQuery
      ? o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_phone.includes(searchQuery) ||
        (o.delivery_address?.pincode && o.delivery_address.pincode.includes(searchQuery)) ||
        (o.pickup_store_name && o.pickup_store_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.razorpay_payment_id && o.razorpay_payment_id.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesStatus && matchesPayment && matchesFulfillment && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const needsVerificationCount = orders.filter(
    o => o.payment_method === 'Razorpay' && o.payment_status === 'Paid' && !o.payment_verified_by_admin
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
            Orders & Fulfillment
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Live order queue, dispatch status tracking, and online Razorpay payment verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/transactions"
            className="inline-flex items-center gap-1.5 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-2xs"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#fed100]" />
            <span>View All Transactions</span>
          </Link>

          <button
            onClick={loadOrders}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold px-4 py-2 rounded-full transition-colors self-start shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Name, Phone, PIN, Payment ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
            />
          </div>

          {/* Payment Filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setPaymentFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                paymentFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Payment Modes
            </button>
            <button
              onClick={() => setPaymentFilter('razorpay')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                paymentFilter === 'razorpay' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              💳 Razorpay
            </button>
            <button
              onClick={() => setPaymentFilter('cod')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                paymentFilter === 'cod' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              💵 COD
            </button>
            {needsVerificationCount > 0 && (
              <button
                onClick={() => setPaymentFilter('needs_verification')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  paymentFilter === 'needs_verification'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-amber-800 bg-amber-100 hover:bg-amber-200'
                }`}
              >
                ⚠️ Needs Verification ({needsVerificationCount})
              </button>
            )}
          </div>

          {/* Fulfillment Filter */}
          <select
            value={fulfillmentFilter}
            onChange={e => setFulfillmentFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#3b711e]"
          >
            <option value="all">All Fulfillment Types</option>
            <option value="pickup">🏪 Store Pickup Orders</option>
            <option value="delivery">🚚 Doorstep Delivery</option>
            {stores.map(st => (
              <option key={st.id} value={st.id}>
                📍 {st.name.replace('VillageDELI – ', '')}
              </option>
            ))}
          </select>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-100 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto">
            {['all', 'Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-[#0d1f15] text-white'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#3b711e]"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>per page</span>
            </div>
            <span>•</span>
            <div>
              Orders Found: <strong className="text-stone-900">{filteredOrders.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-bold uppercase">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-100">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Fulfillment & Location</th>
                  <th className="py-3.5 px-4">Items Count</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedOrders.map(order => {
                  const isRazorpay = order.payment_method === 'Razorpay';
                  const needsVerification = isRazorpay && order.payment_status === 'Paid' && !order.payment_verified_by_admin;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setVerifyMessage('');
                      }}
                      className="hover:bg-stone-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        #{order.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{order.customer_name}</div>
                        <div className="text-[10px] text-stone-400">{order.customer_phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {order.delivery_type === 'pickup' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <Store className="w-3 h-3 text-emerald-600" />
                              <span>Store Pickup</span>
                            </span>
                            <div className="font-bold text-stone-900 text-xs truncate max-w-[180px]">
                              {order.pickup_store_name || order.delivery_address?.area_locality || 'Store Outlet'}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono">
                              PIN: {order.delivery_address?.pincode}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                              <Truck className="w-3 h-3 text-stone-500" />
                              <span>Home Delivery</span>
                            </span>
                            <div className="text-xs text-stone-800 truncate max-w-[180px]">
                              {order.delivery_address?.area_locality || order.delivery_address?.house_flat}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono">
                              PIN: {order.delivery_address?.pincode}
                              {order.nearest_store_name && ` • Hub: ${order.nearest_store_name.replace('VillageDELI – ', '').replace('VillageDELI Hub – ', '')}`}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold">
                        {order.items.length} items
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {isRazorpay ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                <CreditCard className="w-3 h-3 text-blue-600" />
                                <span>Razorpay</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                                <Banknote className="w-3 h-3 text-stone-500" />
                                <span>COD</span>
                              </span>
                            )}

                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                order.payment_status === 'Paid'
                                  ? 'text-green-700 bg-green-50'
                                  : 'text-amber-700 bg-amber-50'
                              }`}
                            >
                              {order.payment_status}
                            </span>
                          </div>

                          {needsVerification && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-full block w-fit">
                              ⚠️ Needs Verification
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        ₹{order.total}
                      </td>

                      <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value as any)}
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

                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        {needsVerification ? (
                          <button
                            onClick={() => handleVerifyPayment(order.id)}
                            className="bg-[#0d1f15] hover:bg-[#173323] text-white px-3 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Verify & Confirm
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setVerifyMessage('');
                            }}
                            className="text-xs font-bold text-[#3b711e] hover:underline cursor-pointer"
                          >
                            Inspect →
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-stone-500">
            No orders match the selected filter criteria.
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && filteredOrders.length > 0 && (
          <div className="p-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div>
              Showing <span className="font-bold text-stone-800">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-bold text-stone-800">
                {Math.min(currentPage * pageSize, filteredOrders.length)}
              </span>{' '}
              of <span className="font-bold text-stone-800">{filteredOrders.length}</span> orders
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

      {/* ==========================================
          ORDER INSPECTION DRAWER / MODAL
          ========================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-serif font-black text-[#0d1f15]">
                    Order #{selectedOrder.id}
                  </h2>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      selectedOrder.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : selectedOrder.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-[#eaf4e6] text-[#2d5c16]'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* Verification Toast Message */}
              {verifyMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-bold text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{verifyMessage}</span>
                </div>
              )}

              {selectedOrder.status === 'Cancelled' && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Order Cancelled</span>
                    <span>{selectedOrder.cancellation_reason || 'Cancelled by user or payment gateway.'}</span>
                  </div>
                </div>
              )}

              {/* Requirement 2: Manual Verification Banner if needed */}
              {selectedOrder.payment_method === 'Razorpay' &&
                selectedOrder.payment_status === 'Paid' &&
                !selectedOrder.payment_verified_by_admin && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>Online Payment Verification Required</span>
                      </div>
                      <p className="text-amber-800 text-[11px]">
                        Customer paid ₹{selectedOrder.total} via Razorpay. Manual admin confirmation is required by store policy before preparing order.
                      </p>
                    </div>

                    <button
                      onClick={() => handleVerifyPayment(selectedOrder.id)}
                      disabled={verifyingPayment}
                      className="bg-[#0d1f15] hover:bg-[#173323] text-white px-4 py-2 rounded-full font-bold text-xs shrink-0 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {verifyingPayment ? 'Verifying...' : 'Verify Payment & Confirm Order'}
                    </button>
                  </div>
                )}

              {/* Status Updater Bar */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-stone-700 block">Fulfillment Step</span>
                  <span className="text-stone-500 text-[11px]">
                    Updating status notifies customer tracking immediately
                  </span>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={e => handleStatusChange(selectedOrder.id, e.target.value as any)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#3b711e]"
                >
                  <option value="Placed">1. Placed (Order Received)</option>
                  <option value="Confirmed">2. Confirmed</option>
                  <option value="Preparing">3. Preparing & Packed</option>
                  <option value="Out for Delivery">4. Out for Delivery</option>
                  <option value="Delivered">5. Delivered & Cash Collected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Gateway Card */}
              <div className="p-4 rounded-xl border border-stone-200 space-y-2 bg-stone-50/50">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {selectedOrder.payment_method === 'Razorpay' ? (
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Banknote className="w-4 h-4 text-stone-600" />
                    )}
                    <span className="font-bold text-stone-900 text-xs">
                      Payment Mode: {selectedOrder.payment_method === 'Razorpay' ? 'Razorpay Online Payment' : 'Cash on Delivery (COD)'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedOrder.payment_status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Payment Status: {selectedOrder.payment_status}
                  </span>
                </div>

                {selectedOrder.payment_method === 'Razorpay' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] border-t border-stone-200">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Razorpay Payment ID:</span>
                      <span className="font-mono font-bold text-stone-800">{selectedOrder.razorpay_payment_id || '—'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Razorpay Order ID:</span>
                      <span className="font-mono font-bold text-stone-800">{selectedOrder.razorpay_order_id || '—'}</span>
                    </div>
                    {selectedOrder.payment_verified_by_admin && (
                      <div className="sm:col-span-2 text-green-700 font-semibold flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified by {selectedOrder.admin_verified_by || 'Admin'} on {new Date(selectedOrder.admin_verified_at || selectedOrder.created_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Customer & Address Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-stone-200 space-y-1">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-stone-400">
                    Customer Details
                  </h4>
                  <div className="font-bold text-stone-900">{selectedOrder.customer_name}</div>
                  <div className="text-stone-600">{selectedOrder.customer_email || 'No email provided'}</div>
                  <div className="text-stone-600">{selectedOrder.customer_phone}</div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold uppercase tracking-wider text-[10px] text-stone-400">
                      {selectedOrder.delivery_type === 'pickup' ? 'Store Pickup Location' : 'Delivery Address'}
                    </h4>
                    {selectedOrder.delivery_type === 'pickup' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Store className="w-3 h-3 text-emerald-600" />
                        <span>Self Pickup</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                        <Truck className="w-3 h-3 text-stone-500" />
                        <span>Doorstep Delivery</span>
                      </span>
                    )}
                  </div>

                  {selectedOrder.delivery_type === 'pickup' ? (
                    <div className="pt-1 space-y-1">
                      <div className="font-bold text-stone-900 text-sm">
                        {selectedOrder.pickup_store_name || selectedOrder.delivery_address?.area_locality}
                      </div>
                      <div className="text-stone-600 leading-relaxed">
                        {selectedOrder.pickup_store_address || selectedOrder.delivery_address?.landmark}
                      </div>
                      {selectedOrder.pickup_store_phone && (
                        <div className="text-stone-500 font-mono text-[11px]">
                          Store Contact: {selectedOrder.pickup_store_phone}
                        </div>
                      )}
                      <div className="font-mono font-bold text-emerald-700 text-[11px] pt-1">
                        PIN: {selectedOrder.delivery_address?.pincode} • Free Store Pickup
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1 space-y-1">
                      <div className="text-stone-800">
                        {selectedOrder.delivery_address?.house_flat}, {selectedOrder.delivery_address?.building_street}
                      </div>
                      <div className="text-stone-800">
                        {selectedOrder.delivery_address?.area_locality}, {selectedOrder.delivery_address?.city}
                      </div>
                      <div className="font-mono font-bold text-stone-900">
                        PIN: {selectedOrder.delivery_address?.pincode}
                      </div>
                      {selectedOrder.nearest_store_name && (
                        <div className="text-stone-500 text-[11px] pt-1">
                          Fulfilled by Outlet: <strong>{selectedOrder.nearest_store_name}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <span className="font-bold block text-[10px] uppercase">Special Notes:</span>
                  <p className="mt-0.5">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-stone-400">
                    Ordered Items ({selectedOrder.items.length})
                  </h4>
                  <span className="text-[11px] text-stone-400">Click item for product preview card</span>
                </div>
                <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
                  {selectedOrder.items.map((i, idx) => (
                    <div
                      key={i.id || idx}
                      onClick={() => setPreviewItem(i)}
                      className="p-3 flex items-center justify-between hover:bg-stone-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={i.product_image || '/assets/cat_fresh_produce.webp'}
                          alt={i.product_name}
                          onError={e => {
                            (e.target as HTMLImageElement).src = '/assets/cat_fresh_produce.webp';
                          }}
                          className="w-12 h-12 object-cover rounded-xl border border-stone-200 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="font-bold text-stone-900 flex items-center gap-2 flex-wrap">
                            <span>{i.product_name}</span>
                            {i.variant_name && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Variant: {i.variant_name}
                              </span>
                            )}
                          </div>
                          <div className="text-stone-500 text-[11px] flex items-center gap-2 mt-0.5">
                            <span>{i.unit || i.product_unit || '1 unit'}</span>
                            <span>•</span>
                            <span>₹{i.unit_price || i.product_price} x {i.quantity}</span>
                            <span className="text-[10px] text-[#3b711e] font-semibold group-hover:underline flex items-center gap-0.5 ml-1">
                              <Eye className="w-3 h-3" /> Preview
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">
                        ₹{i.total_price || i.subtotal || ((i.unit_price || i.product_price || 0) * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Totals */}
              <div className="p-4 rounded-xl bg-stone-50 space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-stone-900">
                    {selectedOrder.delivery_fee === 0 ? 'FREE' : `₹${selectedOrder.delivery_fee}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-sm text-stone-900">
                  <span>Grand Total ({selectedOrder.payment_method === 'Razorpay' ? 'Paid Online' : 'COD'})</span>
                  <span className="text-base text-[#0d1f15]">₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Preview Card Modal (Requirement 4.1) */}
      {previewItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Product Details
              </span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={previewItem.product_image || '/assets/cat_fresh_produce.webp'}
                  alt={previewItem.product_name}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src = '/assets/cat_fresh_produce.webp';
                  }}
                />
              </div>

              <div>
                <h3 className="text-lg font-serif font-black text-stone-900">
                  {previewItem.product_name}
                </h3>
                {previewItem.variant_name && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <span>Selected Variant:</span>
                    <span className="font-black text-emerald-900">{previewItem.variant_name}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100">
                <div>
                  <span className="text-stone-400 block text-[10px]">Unit Price</span>
                  <span className="font-bold text-stone-800">
                    ₹{previewItem.unit_price || previewItem.product_price}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Quantity Ordered</span>
                  <span className="font-bold text-stone-800">{previewItem.quantity} units</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Total Price</span>
                  <span className="font-black text-[#2d5c16] text-sm">
                    ₹{previewItem.total_price || previewItem.subtotal || ((previewItem.unit_price || previewItem.product_price || 0) * previewItem.quantity)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Product ID</span>
                  <span className="font-mono text-stone-600 text-[10px] truncate block">
                    {previewItem.product_id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-full bg-[#0d1f15] hover:bg-[#173323] text-white py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
