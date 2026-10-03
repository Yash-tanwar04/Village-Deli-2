import React, { useState } from 'react';
import { Plus, Minus, Heart, Check, X, Layers } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Variant Modal State (Requirement 4)
  const hasVariants = Boolean(product.has_variants && product.variants && product.variants.length > 0);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants && product.variants ? product.variants[0] : null
  );
  const [modalQty, setModalQty] = useState(1);

  // If no variants, check single product cart quantity
  const cartItem = items.find(item => item.product.id === product.id && !item.selected_variant);
  const quantity = cartItem?.quantity || 0;

  const isOutOfStock = product.stock_quantity <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariants) {
      setShowVariantModal(true);
      return;
    }

    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleConfirmVariantAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedVariant || selectedVariant.stock_quantity <= 0) return;
    addToCart(product, modalQty, selectedVariant);
    setShowVariantModal(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVariants) {
      setShowVariantModal(true);
      return;
    }
    if (quantity < product.stock_quantity) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVariants) {
      setShowVariantModal(true);
      return;
    }
    updateQuantity(product.id, quantity - 1);
  };

  // Min price for variants if available
  const variantPrices = hasVariants && product.variants ? product.variants.map(v => v.price) : [];
  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : null;

  return (
    <>
      <div
        onClick={() => {
          if (hasVariants) {
            setShowVariantModal(true);
          } else if (onOpenDetails) {
            onOpenDetails(product);
          }
        }}
        className="bg-white rounded-2xl border border-stone-200/90 hover:border-[#6cb33f]/70 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer relative"
      >
        {/* Top Image Section */}
        <div className="relative h-44 sm:h-48 bg-stone-50/60 p-4 flex items-center justify-center overflow-hidden">
          {/* Badge (if applicable) */}
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 z-10 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#3b711e] text-white shadow-xs">
              {product.badge}
            </span>
          )}

          {/* Variant tag indicator */}
          {hasVariants && (
            <span className="absolute top-2.5 left-2.5 z-10 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0d1f15] text-[#fed100] shadow-xs flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>Options</span>
            </span>
          )}

          {/* Low Stock Warning Badge */}
          {!isOutOfStock && product.stock_quantity <= product.low_stock_threshold && (
            <span className="absolute bottom-2 left-2.5 z-10 text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Only {product.stock_quantity} left
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-xs transition-colors shadow-2xs ${
              isWishlisted ? 'text-red-500' : 'text-stone-400 hover:text-stone-700'
            }`}
            title="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Product Image */}
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center">
              <span className="bg-white/95 text-stone-900 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info & Purchase Footer */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-sm font-bold text-stone-900 leading-snug group-hover:text-[#3b711e] transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              {hasVariants
                ? `${product.variants?.length} Options available`
                : product.unit}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
            {/* Price */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-stone-950 font-serif">
                {hasVariants && minVariantPrice !== null
                  ? `From ₹${minVariantPrice}`
                  : `₹${product.discount_price ?? product.price}`}
              </span>
              {!hasVariants && product.discount_price && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>

            {/* Action Button */}
            {isOutOfStock ? (
              <button
                disabled
                className="text-[11px] font-bold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full cursor-not-allowed uppercase"
              >
                Unavailable
              </button>
            ) : hasVariants ? (
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center justify-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all shadow-2xs active:scale-95 bg-[#0d1f15] hover:bg-[#173323] text-white cursor-pointer"
              >
                <span>Options</span>
                <Plus className="w-3.5 h-3.5 text-[#fed100]" />
              </button>
            ) : quantity > 0 ? (
              <div className="inline-flex items-center border border-[#3b711e] rounded-full bg-white shadow-2xs overflow-hidden h-9">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-8 h-full flex items-center justify-center text-[#3b711e] hover:bg-[#6cb33f]/10 active:scale-90 transition-all cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-bold text-stone-900 font-mono select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock_quantity}
                  className="w-8 h-full flex items-center justify-center text-[#3b711e] hover:bg-[#6cb33f]/10 active:scale-90 disabled:opacity-30 transition-all cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all shadow-2xs active:scale-95 min-h-[36px] cursor-pointer ${
                  justAdded
                    ? 'bg-[#3b711e] text-white shadow-xs'
                    : 'bg-[#6cb33f]/15 hover:bg-[#3b711e] text-[#2d5c16] hover:text-white border border-[#6cb33f]/40 hover:border-[#3b711e]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VARIANT SELECTION CARD MODAL (Requirement 4) */}
      {/* ======================================================== */}
      {showVariantModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={e => {
            e.stopPropagation();
            setShowVariantModal(false);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowVariantModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 pr-6">
                <h3 className="text-base font-serif font-black text-stone-900 leading-snug truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Choose your preferred option:
                </p>
              </div>
            </div>

            {/* Variant options list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {product.variant_title || 'Available Options'}
                </span>
                <span className="text-[10px] text-stone-400">Select one option</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                {product.variants?.map(variant => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isVarOutOfStock = variant.stock_quantity <= 0;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={isVarOutOfStock}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#3b711e] bg-[#f2f7ef] shadow-xs'
                          : isVarOutOfStock
                          ? 'border-stone-200 bg-stone-100/60 opacity-50 cursor-not-allowed'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#3b711e] bg-[#3b711e]'
                              : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-stone-900 block">
                            {variant.name}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {isVarOutOfStock ? (
                              <span className="text-red-600 font-bold">Out of stock</span>
                            ) : (
                              <span>In Stock: {variant.stock_quantity}</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-sm text-[#0d1f15] font-serif block">
                          ₹{variant.price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity selector */}
              {selectedVariant && selectedVariant.stock_quantity > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="text-xs font-bold text-stone-700">Quantity</span>
                  <div className="inline-flex items-center border border-stone-300 rounded-full bg-stone-50 px-2 py-0.5">
                    <button
                      type="button"
                      onClick={() => setModalQty(prev => Math.max(1, prev - 1))}
                      className="p-1 text-stone-600 hover:text-stone-950 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-900 font-mono">
                      {modalQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalQty(prev => Math.min(selectedVariant.stock_quantity, prev + 1))}
                      disabled={modalQty >= selectedVariant.stock_quantity}
                      className="p-1 text-stone-600 hover:text-stone-950 disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Add Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
                  onClick={handleConfirmVariantAdd}
                  className="w-full bg-[#0d1f15] hover:bg-[#173323] text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#fed100]" />
                  <span>
                    Add to Cart • ₹
                    {selectedVariant ? selectedVariant.price * modalQty : 0}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
