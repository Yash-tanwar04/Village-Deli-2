import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  X,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../../lib/api';
import { Transaction, Order } from '../../types';

export const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Pending' | 'Failed'>('all');
  const [gatewayFilter, setGatewayFilter] = useState<'all' | 'razorpay' | 'cod'>('all');

  // Pagination State (Requirement 1)
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Inspection modal
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifySuccessMsg, setVerifySuccessMsg] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTransaction = async (txn: Transaction) => {
    setSelectedTxn(txn);
    setSelectedOrder(null);
    setVerifySuccessMsg('');

    if (txn.order_id) {
      setLoadingOrder(true);
      try {
        const orderData = await api.getOrderById(txn.order_id);
        setSelectedOrder(orderData);
      } catch (err) {
        console.error('Could not load order details:', err);
      } finally {
        setLoadingOrder(false);
      }
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    if (!orderId) return;
    setVerifying(true);
    setVerifySuccessMsg('');
    try {
      const result = await api.verifyOrderPayment(orderId);
      setVerifySuccessMsg('Payment successfully verified and order confirmed!');

      // Update local transaction state
      if (selectedTxn) {
        const updatedTxn: Transaction = {
          ...selectedTxn,
          admin_verified: true,
          admin_verified_at: new Date().toISOString(),
          admin_verified_by: 'Current Administrator'
        };
        setSelectedTxn(updatedTxn);
        setTransactions(prev => prev.map(t => (t.id === updatedTxn.id ? updatedTxn : t)));
      }
      if (selectedOrder) {
        setSelectedOrder(result.order);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };

  // Filtered transactions
  const filtered = transactions.filter(t => {
    const matchesStatus = statusFilter === 'all' ? true : t.payment_status === statusFilter;
    const matchesGateway = gatewayFilter === 'all' ? true : t.payment_gateway === gatewayFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = q
      ? (t.id && t.id.toLowerCase().includes(q)) ||
        (t.order_id && t.order_id.toLowerCase().includes(q)) ||
        (t.customer_name && t.customer_name.toLowerCase().includes(q)) ||
        (t.customer_phone && t.customer_phone.includes(q)) ||
        (t.customer_email && t.customer_email.toLowerCase().includes(q)) ||
        (t.razorpay_payment_id && t.razorpay_payment_id.toLowerCase().includes(q)) ||
        (t.razorpay_order_id && t.razorpay_order_id.toLowerCase().includes(q))
      : true;

    return matchesStatus && matchesGateway && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, gatewayFilter, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedTransactions = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Calculate stats
  const totalVolume = transactions
    .filter(t => t.payment_status === 'Paid')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const paidCount = transactions.filter(t => t.payment_status === 'Paid').length;
  const pendingCount = transactions.filter(t => t.payment_status === 'Pending').length;
  const failedCount = transactions.filter(t => t.payment_status === 'Failed').length;
  const needsVerificationCount = transactions.filter(
    t => t.payment_gateway === 'razorpay' && t.payment_status === 'Paid' && !t.admin_verified
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
            Transactions & Gateway Logs
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time audit trail of all online Razorpay settlements, COD receipts, and payment signatures
          </p>
        </div>

        <button
          onClick={loadTransactions}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold px-4 py-2 rounded-full transition-colors self-start shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Transactions</span>
        </button>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Settled Volume
          </span>
          <div className="text-xl sm:text-2xl font-serif font-black text-[#0d1f15]">
            ₹{totalVolume.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-stone-500 mt-1 block">Successfully captured</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Total Records
          </span>
          <div className="text-xl sm:text-2xl font-serif font-black text-stone-900">
            {transactions.length}
          </div>
          <span className="text-[10px] text-stone-500 mt-1 block">All attempts & orders</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b711e] block mb-1">
            Successful / Paid
          </span>
          <div className="text-xl sm:text-2xl font-serif font-black text-[#3b711e]">
            {paidCount}
          </div>
          <span className="text-[10px] text-stone-500 mt-1 block">Confirmed revenue</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Needs Verification
          </span>
          <div className="text-xl sm:text-2xl font-serif font-black text-amber-600">
            {needsVerificationCount}
          </div>
          <span className="text-[10px] text-stone-500 mt-1 block">
            {pendingCount > 0 ? `${pendingCount} in pending status` : 'Manual check required'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block mb-1">
            Failed / Cancelled
          </span>
          <div className="text-xl sm:text-2xl font-serif font-black text-red-600">
            {failedCount}
          </div>
          <span className="text-[10px] text-stone-500 mt-1 block">Zero order placed</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by TXN, Order ID, Customer, Payment ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Gateway Filter */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              {(['all', 'razorpay', 'cod'] as const).map(gw => (
                <button
                  key={gw}
                  onClick={() => setGatewayFilter(gw)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                    gatewayFilter === gw
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {gw === 'all' ? 'All Gateways' : gw === 'razorpay' ? '💳 Razorpay' : '💵 COD'}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              {(['all', 'Paid', 'Pending', 'Failed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-[#0d1f15] text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st === 'all' ? 'All Statuses' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold text-stone-500 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-3">
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
            <span>
              Transactions Found: <strong className="text-stone-900">{filtered.length}</strong>
            </span>
          </div>

          {needsVerificationCount > 0 && (
            <span className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px]">
              ⚠️ {needsVerificationCount} payment{needsVerificationCount > 1 ? 's' : ''} awaiting manual admin confirmation
            </span>
          )}
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-bold uppercase">Loading transactions...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-100">
                <tr>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Gateway</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedTransactions.map(txn => {
                  const isRazorpay = txn.payment_gateway === 'razorpay';
                  const needsVerification = isRazorpay && txn.payment_status === 'Paid' && !txn.admin_verified;

                  return (
                    <tr
                      key={txn.id}
                      onClick={() => handleOpenTransaction(txn)}
                      className="hover:bg-stone-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-900">{txn.id}</div>
                        <div className="text-[10px] text-stone-400">
                          {new Date(txn.created_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{txn.customer_name || 'Guest'}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{txn.customer_phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {txn.order_id ? (
                          <span className="font-mono font-bold text-[#3b711e] bg-[#f4f7f2] px-2 py-0.5 rounded border border-[#6cb33f]/30">
                            #{txn.order_id}
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 italic">No Order (Failed)</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isRazorpay ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold">
                            <CreditCard className="w-3 h-3 text-blue-600" />
                            <span>Razorpay</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-bold">
                            <Banknote className="w-3 h-3 text-stone-500" />
                            <span>Cash on Delivery</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        ₹{txn.amount}
                      </td>

                      <td className="py-3.5 px-4">
                        {txn.payment_status === 'Paid' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid</span>
                          </span>
                        )}
                        {txn.payment_status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                        {txn.payment_status === 'Failed' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Failed</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {needsVerification ? (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            ⚠️ Needs Verification
                          </span>
                        ) : txn.admin_verified ? (
                          <span className="text-[10px] font-bold text-green-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span>Verified</span>
                          </span>
                        ) : txn.payment_status === 'Paid' ? (
                          <span className="text-[10px] font-medium text-stone-500">Auto-Confirmed</span>
                        ) : (
                          <span className="text-[10px] text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-bold text-[#3b711e] hover:underline flex items-center justify-end gap-1">
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-stone-500 space-y-1">
            <p className="font-bold text-stone-700">No transactions match your search and filter criteria.</p>
            <p className="text-[11px]">Try adjusting your search query or switching filters.</p>
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
              of <span className="font-bold text-stone-800">{filtered.length}</span> transactions
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
          TRANSACTION INSPECTION MODAL / DRAWER
          ========================================== */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-serif font-black text-[#0d1f15]">
                    Transaction {selectedTxn.id}
                  </h2>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      selectedTxn.payment_status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : selectedTxn.payment_status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedTxn.payment_status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Logged on {new Date(selectedTxn.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* Verification alert message */}
              {verifySuccessMsg && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-bold text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{verifySuccessMsg}</span>
                </div>
              )}

              {/* Action Banner if needs manual verification */}
              {selectedTxn.payment_gateway === 'razorpay' &&
                selectedTxn.payment_status === 'Paid' &&
                !selectedTxn.admin_verified &&
                selectedTxn.order_id && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>Action Required: Payment Verification</span>
                      </div>
                      <p className="text-amber-800 text-[11px]">
                        Customer paid ₹{selectedTxn.amount} online. Confirm receipt to advance Order #{selectedTxn.order_id} to Confirmed status.
                      </p>
                    </div>

                    <button
                      onClick={() => handleVerifyPayment(selectedTxn.order_id!)}
                      disabled={verifying}
                      className="bg-[#0d1f15] hover:bg-[#173323] text-white px-4 py-2 rounded-full font-bold text-xs shrink-0 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {verifying ? 'Verifying...' : 'Verify Payment & Confirm Order'}
                    </button>
                  </div>
                )}

              {/* Gateway & Amount Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Gateway
                  </span>
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    {selectedTxn.payment_gateway === 'razorpay' ? (
                      <>
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Razorpay Online</span>
                      </>
                    ) : (
                      <>
                        <Banknote className="w-4 h-4 text-stone-600" />
                        <span>Cash on Delivery</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Amount
                  </span>
                  <div className="font-bold text-stone-900 text-base">
                    ₹{selectedTxn.amount} {selectedTxn.currency}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Order Reference
                  </span>
                  <div className="font-mono font-bold text-stone-900 text-sm">
                    {selectedTxn.order_id ? `#${selectedTxn.order_id}` : 'None'}
                  </div>
                </div>
              </div>

              {/* Razorpay Gateway Technical IDs */}
              {selectedTxn.payment_gateway === 'razorpay' && (
                <div className="p-4 rounded-xl border border-stone-200 space-y-2.5 bg-stone-50/50">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-stone-500">
                    Razorpay Gateway Credentials
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Razorpay Order ID:</span>
                      <span className="font-mono font-bold text-stone-800 break-all">
                        {selectedTxn.razorpay_order_id || '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 block">Razorpay Payment ID:</span>
                      <span className="font-mono font-bold text-stone-800 break-all">
                        {selectedTxn.razorpay_payment_id || '—'}
                      </span>
                    </div>

                    {selectedTxn.razorpay_signature && (
                      <div className="sm:col-span-2">
                        <span className="text-[10px] text-stone-400 block">HMAC SHA256 Signature:</span>
                        <span className="font-mono text-[10px] text-stone-600 break-all">
                          {selectedTxn.razorpay_signature}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Details (If Failed) */}
              {selectedTxn.payment_status === 'Failed' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1 text-red-900">
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Payment Error Reason</span>
                  </div>
                  <div className="text-[11px]">
                    <strong>Code:</strong> {selectedTxn.error_code || 'TRANSACTION_FAILED'}
                  </div>
                  <div className="text-[11px]">
                    <strong>Description:</strong> {selectedTxn.error_description || 'Payment rejected by bank or dismissed by customer.'}
                  </div>
                  <p className="text-[10px] text-red-700 italic mt-1">
                    Note: Per security guidelines, inventory was NOT decremented and no store order was placed.
                  </p>
                </div>
              )}

              {/* Customer Details */}
              <div className="p-4 rounded-xl border border-stone-200 space-y-1">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-stone-400">
                  Customer Information
                </h4>
                <div className="font-bold text-stone-900">{selectedTxn.customer_name}</div>
                <div className="text-stone-600">{selectedTxn.customer_email || 'No email provided'}</div>
                <div className="text-stone-600">{selectedTxn.customer_phone}</div>
              </div>

              {/* Linked Order Preview if exists */}
              {loadingOrder ? (
                <div className="p-4 rounded-xl border border-stone-200 text-stone-500 text-center text-xs">
                  Loading linked store order details...
                </div>
              ) : selectedOrder ? (
                <div className="p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold uppercase tracking-wider text-[10px] text-stone-400">
                      Linked Store Order
                    </h4>
                    <span className="font-bold text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-800">
                      Status: {selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-stone-700">
                    <div>Items: {selectedOrder.items.length} items</div>
                    <div>Delivery to: {selectedOrder.delivery_address?.area_locality}, PIN {selectedOrder.delivery_address?.pincode}</div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="pt-6 border-t border-stone-100 mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
