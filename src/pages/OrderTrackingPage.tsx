import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  Phone,
  AlertCircle,
  MapPin,
  ChevronRight,
  Store,
  ShoppingBag
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../lib/api';

const TRACKING_STEPS: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  {
    status: 'Placed',
    label: 'Order Placed',
    desc: 'Order received & logged in store database',
    icon: Clock
  },
  {
    status: 'Confirmed',
    label: 'Confirmed',
    desc: 'Store team verified inventory and address',
    icon: CheckCircle2
  },
  {
    status: 'Preparing',
    label: 'Packing Items',
    desc: 'Handpicked fresh items packed in thermal bags',
    icon: Package
  },
  {
    status: 'Out for Delivery',
    label: 'Out for Delivery',
    desc: 'Rider is on the way to your doorstep',
    icon: Truck
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    desc: 'Delivered successfully & payment received',
    icon: Home
  }
];

const PICKUP_TRACKING_STEPS: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  {
    status: 'Placed',
    label: 'Order Placed',
    desc: 'Order logged & store notified',
    icon: Clock
  },
  {
    status: 'Confirmed',
    label: 'Confirmed',
    desc: 'Store team accepted & verified stock',
    icon: CheckCircle2
  },
  {
    status: 'Preparing',
    label: 'Packing at Store',
    desc: 'Fresh items packed & bagged',
    icon: Package
  },
  {
    status: 'Out for Delivery',
    label: 'Ready for Pickup',
    desc: 'Available at store counter for pickup',
    icon: Store
  },
  {
    status: 'Delivered',
    label: 'Collected',
    desc: 'Picked up successfully by customer',
    icon: ShoppingBag
  }
];

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchInput, setSearchInput] = useState(id || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      handleTrack(id);
    }
  }, [id]);

  const handleTrack = async (orderIdToTrack: string) => {
    if (!orderIdToTrack.trim()) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await api.getOrder(orderIdToTrack.trim());
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setErrorMessage('Order not found. Please check your Order ID (e.g. VDL-000121) and try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(searchInput);
  };

  // Determine active step index
  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Preparing':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const activeIndex = order ? getStepIndex(order.status || 'Placed') : 0;
  const isCancelled = order?.status === 'Cancelled';
  const currentSteps = order?.delivery_type === 'pickup' ? PICKUP_TRACKING_STEPS : TRACKING_STEPS;

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-20 pb-20">
      {/* Top Banner */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3b711e] bg-[#f2f6ee] px-3 py-1 rounded-full border border-[#6cb33f]/30">
              {order?.delivery_type === 'pickup' ? 'LIVE OUTLET PICKUP TRACKER' : 'LIVE FULFILLMENT TRACKER'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0d1f15]">
              {order?.delivery_type === 'pickup' ? 'Track Store Pickup' : 'Track Your Delivery'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              {order?.delivery_type === 'pickup'
                ? 'Check real-time packing and counter-ready status of your store pickup order.'
                : 'Enter your Order ID (e.g. VDL-000121) below to check the real-time status of your groceries.'}
            </p>

            {/* Search Input Bar */}
            <form onSubmit={onSearchSubmit} className="pt-2 flex items-center max-w-md mx-auto gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="e.g. VDL-000121"
                  className="w-full text-xs font-mono pl-10 pr-3 py-3 rounded-full border border-stone-300 focus:outline-none focus:border-[#3b711e] bg-stone-50 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {order ? (
          <div className="space-y-6">
            {/* 1. STATUS CARD & 5-STEP TIMELINE */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-8">
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-serif font-black text-stone-900">
                      Order #{order.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isCancelled
                          ? 'bg-red-100 text-red-700'
                          : order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-[#eaf4e6] text-[#2d5c16]'
                      }`}
                    >
                      {order.delivery_type === 'pickup' && order.status === 'Out for Delivery' ? 'Ready for Pickup' : order.status}
                    </span>
                    {order.delivery_type === 'pickup' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f2f6ee] text-[#3b711e] border border-[#6cb33f]/30 flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        <span>Store Pickup</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Placed on {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-500 block">
                    {order.payment_method === 'Razorpay' 
                      ? 'Total Paid Online' 
                      : order.delivery_type === 'pickup' 
                        ? 'Pay at Store Counter' 
                        : 'Total COD Amount'}
                  </span>
                  <span className="text-xl font-serif font-black text-[#0d1f15]">
                    ₹{order.total}
                  </span>
                </div>
              </div>

              {/* TIMELINE */}
              {isCancelled ? (
                <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center text-red-700">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <h3 className="font-bold text-sm">This order was cancelled</h3>
                  <p className="text-xs text-red-600 mt-1">
                    If you have questions, please reach out to our customer care team.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-6 left-8 right-8 h-1 bg-stone-100 -z-0">
                    <div
                      className="bg-[#3b711e] h-full transition-all duration-500"
                      style={{ width: `${(activeIndex / (currentSteps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                    {currentSteps.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div key={step.status} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                              isCompleted
                                ? 'bg-[#3b711e] border-[#3b711e] text-white shadow-md'
                                : 'bg-white border-stone-200 text-stone-400'
                            } ${isCurrent ? 'ring-4 ring-[#6cb33f]/25 scale-110' : ''}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="min-w-0">
                            <h4
                              className={`text-xs font-bold leading-tight ${
                                isCompleted ? 'text-stone-900' : 'text-stone-400'
                              }`}
                            >
                              {step.label}
                            </h4>
                            <p className="text-[10px] text-stone-500 hidden sm:block mt-1">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. ORDER DETAILS & ADDRESS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Delivery / Store Pickup Location Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 mb-2">
                  {order.delivery_type === 'pickup' ? (
                    <>
                      <Store className="w-3.5 h-3.5 text-[#3b711e]" />
                      <span>Pickup Outlet Location</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-[#3b711e]" />
                      <span>Delivery Address</span>
                    </>
                  )}
                </h3>
                {order.delivery_type === 'pickup' ? (
                  <div className="text-xs text-stone-800 space-y-2">
                    <div className="font-bold text-[#0d1f15] text-sm">
                      {order.pickup_store_name || 'Retail Outlet'}
                    </div>
                    <div className="text-stone-600 leading-relaxed bg-[#f4f7f2] p-2.5 rounded-lg border border-[#6cb33f]/20">
                      {order.pickup_store_address || `${order.delivery_address.house_flat}, ${order.delivery_address.building_street}, ${order.delivery_address.area_locality}, ${order.delivery_address.city}`}
                    </div>
                    {order.pickup_store_phone && (
                      <div className="text-stone-600 font-medium">Store Phone: {order.pickup_store_phone}</div>
                    )}
                    <div className="pt-1 border-t border-stone-100 text-stone-500 text-[11px]">
                      Collect under name: <strong className="text-stone-700">{order.delivery_address.full_name}</strong> ({order.delivery_address.phone})
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

              {/* Support & Assistance Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#3b711e]" />
                  <span>{order.delivery_type === 'pickup' ? 'Outlet Assistance' : 'Store Assistance'}</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {order.delivery_type === 'pickup'
                    ? 'Need store directions or have special instructions for packing your pickup?'
                    : 'Need to modify delivery instructions or check in with your delivery driver?'}
                </p>
                <div className="pt-2 text-xs space-y-1 text-stone-800">
                  <div>
                    <span className="text-stone-400">Store Helpline:</span>{' '}
                    <strong className="text-stone-900">{order.pickup_store_phone || '+91 124 456 7890'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Direct Desk:</span>{' '}
                    <strong className="text-stone-900">24/7 Customer Care</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ORDER ITEMS PREVIEW */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Items In This Shipment ({order.items.length})
              </h3>
              <div className="divide-y divide-stone-100">
                {order.items.map(item => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#3b711e]">{item.quantity}x</span>
                      <span className="text-stone-800 font-medium">{item.product_name}</span>
                      <span className="text-stone-400 text-[11px]">({item.unit})</span>
                    </div>
                    <span className="font-bold text-stone-900">₹{item.total_price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold font-serif text-stone-900 mb-1">
                Enter an Order ID to Track
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Your Order Reference number is displayed on your order confirmation screen and store receipt.
              </p>
              <Link
                to="/order-now"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3b711e] hover:underline"
              >
                <span>Browse VillageDELI aisles</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};
