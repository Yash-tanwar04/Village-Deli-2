import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    total,
    itemCount
  } = useCart();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Top Bar */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0d1f15] text-[#fed100] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900 font-serif">Your Cart</h2>
                <p className="text-xs text-stone-500">{itemCount} items</p>
              </div>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          {items.length > 0 && (
            <div className="bg-[#f7f9f3] px-5 py-3 border-b border-stone-200/70">
              <div className="flex items-center gap-2 text-xs mb-1.5">
                <Truck className="w-4 h-4 text-[#3b711e] shrink-0" />
                {freeDeliveryRemaining === 0 ? (
                  <span className="text-[#3b711e] font-bold">
                    You have unlocked FREE delivery! 🎉
                  </span>
                ) : (
                  <span className="text-stone-700 font-medium">
                    Add <strong className="text-[#0d1f15]">₹{freeDeliveryRemaining}</strong> more for{' '}
                    <strong className="text-[#3b711e]">FREE delivery</strong>
                  </span>
                )}
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#6cb33f] h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-serif mb-1">
                  YOUR CART IS EMPTY
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Looks like you haven't added anything yet. Explore our farm-fresh produce and daily essentials!
                </p>
                <Link
                  to="/order-now"
                  onClick={closeCartDrawer}
                  className="inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider transition-colors"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              items.map(({ product, quantity, selected_variant }) => {
                const activePrice = selected_variant
                  ? selected_variant.price
                  : product.discount_price !== null && product.discount_price !== undefined
                  ? product.discount_price
                  : product.price;

                const maxStock = selected_variant ? selected_variant.stock_quantity : product.stock_quantity;
                const itemKey = `${product.id}${selected_variant ? '-' + selected_variant.id : ''}`;

                return (
                  <div
                    key={itemKey}
                    className="flex gap-3.5 p-3 rounded-2xl border border-stone-100 bg-stone-50/70 hover:bg-stone-50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-200/80 shrink-0 p-1 flex items-center justify-center">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 leading-snug">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="text-[11px] text-stone-500 font-medium">
                              {selected_variant ? selected_variant.name : product.unit}
                            </span>
                            {selected_variant && (
                              <span className="text-[9px] font-bold bg-[#eef5ea] text-[#2d5c16] border border-[#6cb33f]/30 px-1.5 py-0.2 rounded-full">
                                {selected_variant.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id, selected_variant?.id)}
                          className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                        {/* Quantity Selector */}
                        <div className="inline-flex items-center border border-stone-300 rounded-full bg-white px-2 py-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1, selected_variant?.id)}
                            className="p-1 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-stone-900 font-mono">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1, selected_variant?.id)}
                            disabled={quantity >= maxStock}
                            className="p-1 text-stone-600 hover:text-stone-950 disabled:opacity-30 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-bold text-stone-950 font-serif">
                            ₹{activePrice * quantity}
                          </span>
                          {!selected_variant && product.discount_price && (
                            <span className="text-[10px] text-stone-400 line-through block -mt-1">
                              ₹{product.price * quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white shadow-lg space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee</span>
                  <span
                    className={`font-semibold ${
                      deliveryFee === 0 ? 'text-[#3b711e] font-bold' : 'text-stone-900'
                    }`}
                  >
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-lg font-serif text-[#0d1f15]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#0d1f15] hover:bg-[#173323] text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-stone-400 text-center">
                Cash on Delivery (COD) supported across serviceable pin codes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
