import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, deliveryPincode, setDeliveryPincode } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [localQty, setLocalQty] = useState(1);
  const [pincodeInput, setPincodeInput] = useState(deliveryPincode || '122017');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (id) {
      loadProductData(id);
    }
  }, [id]);

  const loadProductData = async (productId: string) => {
    setLoading(true);
    try {
      const prod = await api.getProduct(productId);
      setProduct(prod);
      setActiveImage(prod.image_url);

      if (prod.category_id) {
        const [cats, related] = await Promise.all([
          api.getCategories(),
          api.getProducts({ category_id: prod.category_id, status: 'published' })
        ]);
        const matchedCat = cats.find(c => c.id === prod.category_id);
        setCategory(matchedCat || null);
        setRelatedProducts(related.filter(p => p.id !== prod.id).slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load product details:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleAddToCart = () => {
    if (!product || product.stock_quantity <= 0) return;
    addToCart(product, localQty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const checkPincode = async () => {
    if (!/^\d{6}$/.test(pincodeInput)) {
      setPincodeStatus('invalid');
      return;
    }
    try {
      const settings = await api.getStoreSettings();
      const serviceable = settings.serviceable_pincodes || ['122001', '122002', '122017', '122018', '160017', '160019', '160022'];
      if (serviceable.includes(pincodeInput.trim())) {
        setPincodeStatus('valid');
        setDeliveryPincode(pincodeInput.trim());
      } else {
        setPincodeStatus('invalid');
      }
    } catch {
      setPincodeStatus('valid');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
            Loading fresh item details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center pt-20 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-stone-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold font-serif text-stone-900 mb-2">Product Not Found</h2>
          <p className="text-xs text-stone-500 mb-6">
            The requested product could not be located or may have been unstocked.
          </p>
          <Link
            to="/order-now"
            className="inline-flex items-center gap-2 bg-[#0d1f15] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#173323] transition-colors uppercase tracking-wider"
          >
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  const effectivePrice = product.discount_price ?? product.price;
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;
  const savings = hasDiscount ? product.price - (product.discount_price || 0) : 0;
  const isOutOfStock = product.stock_quantity <= 0;

  const allImages = [product.image_url, ...(product.additional_images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-20">
      {/* 1. BREADCRUMBS */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link to="/" className="hover:text-[#3b711e] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link to="/order-now" className="hover:text-[#3b711e] transition-colors">
              Order Now
            </Link>
            {category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                <Link
                  to={`/category/${category.slug}`}
                  className="hover:text-[#3b711e] transition-colors capitalize"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 2. PRODUCT MAIN OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT: IMAGE GALLERY */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-2xl bg-stone-50/70 border border-stone-100 flex items-center justify-center p-8 overflow-hidden group">
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#3b711e] text-white shadow-xs">
                    {product.badge}
                  </span>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center z-20">
                    <span className="bg-white text-stone-900 font-bold text-sm uppercase tracking-wider px-4 py-2 rounded-full shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
                <img
                  src={activeImage || product.image_url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Thumbnails row */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl border-2 p-1.5 bg-stone-50 flex items-center justify-center shrink-0 transition-all ${
                        activeImage === img ? 'border-[#3b711e] shadow-xs' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: PRODUCT INFO & PURCHASE */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#3b711e] uppercase tracking-wider bg-[#f2f6ee] px-2.5 py-0.5 rounded-md">
                    {product.brand || 'VillageDELI Fresh'}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">SKU: {product.sku}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15] leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  Unit: <span className="text-stone-800 font-bold">{product.unit}</span>
                  {product.weight_quantity && ` (${product.weight_quantity})`}
                </p>
              </div>

              {/* Price section */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#0d1f15]">₹{effectivePrice}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-stone-400 line-through">₹{product.price}</span>
                    <span className="text-xs font-bold text-[#3b711e] bg-[#eaf4e6] px-2 py-0.5 rounded-full">
                      Save ₹{savings}
                    </span>
                  </>
                )}
                <span className="text-[11px] text-stone-400 ml-auto">Inclusive of all taxes</span>
              </div>

              {/* Stock status indicator */}
              <div>
                {isOutOfStock ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Currently out of stock. Check back soon.</span>
                  </div>
                ) : product.stock_quantity <= product.low_stock_threshold ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Hurry! Only {product.stock_quantity} left in stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3b711e]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In Stock — Ready for 30–45 min delivery</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity adjuster */}
                <div className="flex items-center border border-stone-300 rounded-full p-1 bg-white w-32 justify-between">
                  <button
                    onClick={() => setLocalQty(Math.max(1, localQty - 1))}
                    disabled={isOutOfStock || localQty <= 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm text-stone-900">{localQty}</span>
                  <button
                    onClick={() => setLocalQty(Math.min(product.stock_quantity, localQty + 1))}
                    disabled={isOutOfStock || localQty >= product.stock_quantity}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : justAdded
                      ? 'bg-[#3b711e] text-white'
                      : 'bg-[#0d1f15] hover:bg-[#173323] text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[#fed100]" />
                      <span>Add to Basket • ₹{effectivePrice * localQty}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Pincode Availability Checker */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                  <MapPin className="w-4 h-4 text-[#3b711e]" />
                  <span>Check Delivery Availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={e => {
                      setPincodeInput(e.target.value);
                      setPincodeStatus('idle');
                    }}
                    placeholder="Enter 6-digit PIN"
                    className="w-40 text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#3b711e] font-mono bg-white"
                  />
                  <button
                    onClick={checkPincode}
                    className="bg-[#0d1f15] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#173323]"
                  >
                    Check
                  </button>
                </div>
                {pincodeStatus === 'valid' && (
                  <p className="text-[11px] font-bold text-[#3b711e] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Delivery available in 30–45 mins to PIN {pincodeInput}!
                  </p>
                )}
                {pincodeStatus === 'invalid' && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Sorry, we do not currently deliver to this PIN code.
                  </p>
                )}
              </div>

              {/* Description & Dietary tags */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  About This Item
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {product.description ||
                    'Harvested from certified partner growers and prepared to strict quality benchmarks. 100% natural with no artificial preservatives or adulteration.'}
                </p>

                {product.dietary_tags && product.dietary_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {product.dietary_tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-100 text-center">
                <div className="p-3 rounded-xl bg-stone-50">
                  <ShieldCheck className="w-5 h-5 text-[#3b711e] mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-stone-900 leading-tight">100% Quality</div>
                  <div className="text-[9px] text-stone-400">Guaranteed Fresh</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50">
                  <Truck className="w-5 h-5 text-[#3b711e] mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-stone-900 leading-tight">Fast 30-45m</div>
                  <div className="text-[9px] text-stone-400">Doorstep Delivery</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50">
                  <RotateCcw className="w-5 h-5 text-[#3b711e] mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-stone-900 leading-tight">No Questions</div>
                  <div className="text-[9px] text-stone-400">Instant Replacement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RELATED PRODUCTS IN SAME CATEGORY */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-serif font-black text-[#0d1f15]">
                You May Also Like
              </h3>
              <p className="text-xs text-stone-500">More fresh picks from this department</p>
            </div>
            {category && (
              <Link
                to={`/category/${category.slug}`}
                className="text-xs font-bold text-[#3b711e] hover:underline"
              >
                View all {category.name}
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
