import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    total,
    itemCount
  } = useCart();

  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-28 pb-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 sm:p-14 text-center border border-stone-200/90 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-5 text-stone-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-serif font-black text-stone-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm max-w-sm mx-auto mb-8">
            You haven't added any fresh groceries to your basket yet. Explore our farm produce and daily essentials!
          </p>
          <Link
            to="/order-now"
            className="inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-8 py-3.5 rounded-full transition-all shadow-md uppercase tracking-wider"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4 text-[#fed100]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-20 pb-16">
      {/* 1. BREADCRUMBS */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link to="/" className="hover:text-[#3b711e]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link to="/order-now" className="hover:text-[#3b711e]">Order Now</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">Shopping Basket ({itemCount})</span>
          </nav>
        </div>
      </div>

      {/* 2. MAIN CART VIEW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
            Shopping Basket
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-stone-500 hover:text-red-600 transition-colors font-semibold"
          >
            Clear All Items
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: ITEMS LIST */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Meter */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#3b711e]" />
                  {freeDeliveryRemaining === 0 ? (
                    <span className="text-[#3b711e] font-bold">
                      🎉 You have qualified for FREE Doorstep Delivery!
                    </span>
                  ) : (
                    <span className="text-stone-700 font-medium">
                      Add <strong className="text-[#0d1f15]">₹{freeDeliveryRemaining}</strong> more to unlock{' '}
                      <strong className="text-[#3b711e]">FREE delivery</strong>
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-stone-500 font-mono">
                  {Math.round(freeDeliveryProgress)}%
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#6cb33f] h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Items Table / Cards */}
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 shadow-2xs overflow-hidden">
              {items.map(item => {
                const effectivePrice = item.selected_variant
                  ? item.selected_variant.price
                  : item.product.discount_price ?? item.product.price;
                const lineTotal = effectivePrice * item.quantity;
                const maxStock = item.selected_variant ? item.selected_variant.stock_quantity : item.product.stock_quantity;
                const itemKey = `${item.product.id}${item.selected_variant ? '-' + item.selected_variant.id : ''}`;

                return (
                  <div key={itemKey} className="p-4 sm:p-5 flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-50 p-2 shrink-0 border border-stone-100 flex items-center justify-center">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        <span className="text-[11px] text-stone-500">
                          {item.selected_variant ? item.selected_variant.name : item.product.unit} • ₹{effectivePrice} / unit
                        </span>
                        {item.selected_variant && (
                          <span className="text-[10px] font-bold bg-[#eef5ea] text-[#2d5c16] border border-[#6cb33f]/30 px-2 py-0.2 rounded-full">
                            Variant: {item.selected_variant.name}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-[#0d1f15] mt-1 sm:hidden">
                        ₹{lineTotal}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-stone-300 rounded-full p-0.5 bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selected_variant?.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-stone-600 hover:bg-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selected_variant?.id)}
                        disabled={item.quantity >= maxStock}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-stone-600 hover:bg-white disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Desktop Line Total */}
                    <div className="hidden sm:block text-right w-24">
                      <span className="text-sm font-bold text-[#0d1f15]">₹{lineTotal}</span>
                      {!item.selected_variant && item.product.discount_price && (
                        <div className="text-[10px] text-stone-400 line-through">
                          ₹{item.product.price * item.quantity}
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selected_variant?.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-full transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping Link */}
            <div className="pt-2">
              <Link
                to="/order-now"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3b711e] hover:underline"
              >
                <span>← Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
              <h2 className="text-base font-serif font-black text-stone-900 border-b border-stone-100 pb-3">
                Order Summary
              </h2>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Item Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Estimated Delivery Fee</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-[#3b711e] font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-sm font-bold text-stone-900">
                  <span>Grand Total</span>
                  <span className="text-lg text-[#0d1f15] font-black">₹{total}</span>
                </div>
              </div>

              {/* COD Note */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900">
                <p className="font-bold mb-0.5">💵 Cash on Delivery (COD) Only</p>
                <p className="text-amber-800 leading-tight">
                  No advance payment needed. Pay in cash or UPI to the delivery executive at your doorstep.
                </p>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#fed100]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3b711e]" />
                <span>Verified 100% Quality & Freshness Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
