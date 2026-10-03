import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  ArrowRight,
  Printer,
  Store
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../lib/api';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
  }, [id]);

  const loadOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const data = await api.getOrder(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order confirmation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
            Retrieving order confirmation...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center pt-20 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-stone-900 mb-2">Order Not Found</h2>
          <p className="text-xs text-stone-500 mb-6">
            We couldn't retrieve the details for this order number.
          </p>
          <Link
            to="/order-now"
            className="inline-flex items-center gap-2 bg-[#0d1f15] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#173323] transition-colors"
          >
            <span>Back to Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* DYNAMIC HERO CARD (Requirements 1 & 1.1) */}
        {order.status === 'Cancelled' ? (
          <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-12 shadow-sm text-center mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-red-500" />
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              ✕
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              ORDER CANCELLED
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 mt-4 mb-2">
              Payment Not Completed
            </h1>
            <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
              This order was cancelled or payment was unsuccessful. Your cart has been preserved so you can retry checkout.
            </p>
            {order.cancellation_reason && (
              <div className="mt-4 inline-block bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-2 rounded-xl">
                <strong>Reason:</strong> {order.cancellation_reason}
              </div>
            )}
          </div>
        ) : order.payment_method === 'Razorpay' && !order.payment_verified_by_admin ? (
          <div className="bg-white rounded-3xl border border-amber-200 p-8 sm:p-12 shadow-sm text-center mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-[#6cb33f]" />
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-9 h-9" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-300">
              PAYMENT RECEIVED — AWAITING ADMIN CONFIRMATION
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0d1f15] mt-4 mb-2">
              Payment Received, {order.customer_name}!
            </h1>
            <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
              Your online payment of <strong className="text-stone-900">₹{order.total}</strong> via Razorpay was successful (Payment ID: <span className="font-mono font-bold text-stone-800">{order.razorpay_payment_id || 'Captured'}</span>).
              Our store admin will review and confirm your order shortly before dispatch.
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs">
              <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Order Reference</span>
                <span className="font-mono font-black text-stone-900 text-sm">{order.id}</span>
              </div>
              <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                <span className="text-amber-700 block text-[10px] uppercase font-bold">Verification Status</span>
                <span className="font-bold text-amber-800 text-sm">Under Admin Review</span>
              </div>
              <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Payment Method</span>
                <span className="font-bold text-[#3b711e] text-sm">💳 Razorpay Online (Paid)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm text-center mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3b711e] via-[#6cb33f] to-[#fed100]" />
            <div className="w-16 h-16 rounded-full bg-[#eaf4e6] text-[#3b711e] flex items-center justify-center mx-auto mb-4">
              {order.delivery_type === 'pickup' ? (
                <Store className="w-10 h-10 text-emerald-700" />
              ) : (
                <CheckCircle2 className="w-10 h-10" />
              )}
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#3b711e] bg-[#f2f6ee] px-3 py-1 rounded-full border border-[#6cb33f]/30">
              {order.delivery_type === 'pickup'
                ? 'STORE PICKUP ORDER CONFIRMED'
                : order.payment_method === 'Razorpay'
                ? 'PAYMENT VERIFIED & ORDER CONFIRMED'
                : 'CASH ON DELIVERY ORDER PLACED'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0d1f15] mt-4 mb-2">
              Thank you, {order.customer_name}!
            </h1>
            <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
              {order.delivery_type === 'pickup'
                ? `Your order will be packed and ready for pickup at ${order.pickup_store_name || 'our store outlet'} in 20–30 minutes!`
                : order.payment_method === 'Razorpay'
                ? 'Your payment was verified and your fresh groceries are being prepared for express delivery.'
                : 'Your order has been received and sent to our nearest fulfillment store. Payment will be collected on delivery.'}
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs">
              <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Order Reference</span>
                <span className="font-mono font-black text-stone-900 text-sm">{order.id}</span>
              </div>
              <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  {order.delivery_type === 'pickup' ? 'Ready For Pickup' : 'Estimated Delivery'}
                </span>
                <span className="font-bold text-[#3b711e] text-sm flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {order.delivery_type === 'pickup' ? '20–30 Minutes' : '30–45 Minutes'}
                </span>
              </div>
              <div className="bg-stone-50 px-4 py-2 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Payment Method</span>
                <span className="font-bold text-stone-900 text-sm">
                  {order.payment_method === 'Razorpay' ? (
                    <span className="text-[#3b711e] flex items-center gap-1">
                      💳 Razorpay Online ({order.payment_status})
                    </span>
                  ) : (
                    '💵 Pay at Counter / COD'
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ORDER DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* LEFT: ITEMS BREAKDOWN */}
          <div className="md:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 font-serif">
                Items In This Order ({order.items.length})
              </h2>
              <button
                onClick={handlePrint}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>

            {/* Items List */}
            <div className="divide-y divide-stone-100">
              {order.items.map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-stone-50 p-1.5 shrink-0 border border-stone-100 flex items-center justify-center">
                      <img
                        src={item.product_image || item.product?.image_url || '/assets/cat_fresh_produce.webp'}
                        alt={item.product_name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.product_name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {item.unit} • ₹{item.unit_price} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-900 shrink-0">
                    ₹{item.total_price}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-stone-900">
                  {order.delivery_fee === 0 ? (
                    <span className="text-[#3b711e] font-bold">FREE</span>
                  ) : (
                    `₹${order.delivery_fee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-sm font-bold text-stone-900">
                <span>{order.payment_method === 'Razorpay' ? 'Total Paid Online' : 'Amount to Pay on Delivery'}</span>
                <span className="text-xl text-[#0d1f15] font-black">₹{order.total}</span>
              </div>
            </div>

            {/* Preparation Notice */}
            <div className="p-4 rounded-xl bg-[#f4f7f2] border border-[#6cb33f]/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#3b711e] shrink-0 mt-0.5" />
              <div className="text-xs text-stone-700">
                <span className="font-bold">
                  {order.delivery_type === 'pickup' 
                    ? 'Store Pickup Order - In Preparation'
                    : order.payment_method === 'Razorpay' 
                      ? 'Payment Verified & In Preparation' 
                      : 'Order Received & In Preparation'}
                </span>
                <p className="text-stone-500 mt-0.5">
                  {order.delivery_type === 'pickup' ? (
                    <>
                      Your items are being packed at <strong className="text-stone-800">{order.pickup_store_name || 'our store'}</strong>. 
                      Estimated pickup readiness is within <strong className="text-[#3b711e]">20–30 minutes</strong>.
                      {order.payment_method === 'COD' && (
                        <span> Amount of <strong className="text-stone-800">₹{order.total}</strong> can be paid directly at the store counter.</span>
                      )}
                    </>
                  ) : order.payment_method === 'Razorpay' ? (
                    <>
                      Payment of <strong className="text-stone-800">₹{order.total}</strong> was received via Razorpay
                      {order.razorpay_payment_id && ` (Payment ID: ${order.razorpay_payment_id})`}. Our store team is hand-packing your fresh items.
                    </>
                  ) : (
                    <>
                      Our store team has received your order and is hand-packing your items. Payment of <strong className="text-stone-800">₹{order.total}</strong> will be collected upon doorstep delivery.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: DELIVERY & TRACKING SIDEBAR */}
          <div className="md:col-span-4 space-y-4">
            {/* Delivery / Pickup Address Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                {order.delivery_type === 'pickup' ? (
                  <>
                    <Store className="w-3.5 h-3.5 text-[#3b711e]" />
                    <span>Pickup Store Location</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-[#3b711e]" />
                    <span>Delivery Destination</span>
                  </>
                )}
              </h3>
              {order.delivery_type === 'pickup' ? (
                <div className="text-xs text-stone-800 space-y-2">
                  <div className="font-bold text-[#0d1f15] text-sm flex items-center gap-1.5">
                    {order.pickup_store_name || 'Selected Retail Store'}
                  </div>
                  <div className="text-stone-600 leading-relaxed bg-[#f4f7f2] p-2.5 rounded-lg border border-[#6cb33f]/20">
                    {order.pickup_store_address || `${order.delivery_address.house_flat}, ${order.delivery_address.building_street}, ${order.delivery_address.area_locality}, ${order.delivery_address.city}`}
                  </div>
                  {order.pickup_store_phone && (
                    <div className="text-stone-600 font-medium">Store Helpline: {order.pickup_store_phone}</div>
                  )}
                  <div className="pt-2 border-t border-stone-100 text-stone-500">
                    Ordered for: <span className="font-semibold text-stone-700">{order.delivery_address.full_name}</span> ({order.delivery_address.phone})
                  </div>
                </div>
              ) : (
                <div className="text-xs text-stone-800 space-y-1">
                  <div className="font-bold">{order.delivery_address.full_name}</div>
                  <div>{order.delivery_address.house_flat}, {order.delivery_address.building_street}</div>
                  <div>{order.delivery_address.area_locality}</div>
                  <div>{order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</div>
                  <div className="text-stone-500 pt-1">Phone: {order.delivery_address.phone}</div>
                  {order.nearest_store_name && (
                    <div className="mt-2 pt-2 border-t border-stone-100 text-[11px] text-[#3b711e] font-semibold flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      <span>Fulfillment Hub: {order.nearest_store_name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to={`/order-tracking/${order.id}`}
                className="w-full flex items-center justify-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <Truck className="w-4 h-4 text-[#fed100]" />
                <span>Track Live Order Status</span>
              </Link>

              <Link
                to="/order-now"
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 py-3 rounded-full text-xs font-bold transition-all"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
