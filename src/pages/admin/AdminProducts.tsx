import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Package,
  AlertCircle,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { api } from '../../lib/api';
import { Product, Category, ProductVariant } from '../../types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Pagination State (Requirement 1)
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('VillageDELI Fresh');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [unit, setUnit] = useState('500g');
  const [weightQuantity, setWeightQuantity] = useState('500g');
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badge, setBadge] = useState('');
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [isFeatured, setIsFeatured] = useState(false);

  // Variants State (Requirement 4)
  const [hasVariants, setHasVariants] = useState(false);
  const [variantTitle, setVariantTitle] = useState('Pack Size');
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error('Failed to load products/categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setBrand('VillageDELI Fresh');
    setSku('VDL-' + Math.floor(100000 + Math.random() * 900000));
    setPrice('');
    setDiscountPrice('');
    setUnit('500g');
    setWeightQuantity('500g');
    setStockQuantity(50);
    setLowStockThreshold(10);
    setDescription('');
    setImageUrl('/assets/cat_fresh_produce.webp');
    setBadge('Farm Fresh');
    setDietaryTags(['Organic', 'Farm Fresh']);
    setStatus('published');
    setIsFeatured(false);
    setHasVariants(false);
    setVariantTitle('Pack Size');
    setVariants([]);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.category_id);
    setBrand(p.brand || 'VillageDELI Fresh');
    setSku(p.sku);
    setPrice(p.price);
    setDiscountPrice(p.discount_price ?? '');
    setUnit(p.unit);
    setWeightQuantity(p.weight_quantity || p.unit);
    setStockQuantity(p.stock_quantity);
    setLowStockThreshold(p.low_stock_threshold);
    setDescription(p.description || '');
    setImageUrl(p.image_url);
    setBadge(p.badge || '');
    setDietaryTags(p.dietary_tags || []);
    setStatus(p.status);
    setIsFeatured(p.is_featured);
    setHasVariants(Boolean(p.has_variants));
    setVariantTitle(p.variant_title || 'Pack Size');
    setVariants(p.variants || []);
    setFormError('');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setImageUrl(res.url);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleDietaryTag = (tag: string) => {
    setDietaryTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || price === '' || !unit.trim() || !imageUrl.trim()) {
      setFormError('Please enter product name, price, unit, and image.');
      return;
    }

    if (hasVariants && variants.length === 0) {
      setFormError('Please add at least one variant option or uncheck multiple variants.');
      return;
    }

    const finalPrice = hasVariants && variants.length > 0
      ? Math.min(...variants.map(v => v.price))
      : Number(price);
    const finalStock = hasVariants && variants.length > 0
      ? variants.reduce((sum, v) => sum + v.stock_quantity, 0)
      : Number(stockQuantity);

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category_id: categoryId,
        brand: brand.trim(),
        sku: sku.trim(),
        price: finalPrice,
        discount_price: discountPrice !== '' ? Number(discountPrice) : null,
        unit: unit.trim(),
        weight_quantity: weightQuantity.trim() || unit.trim(),
        stock_quantity: finalStock,
        low_stock_threshold: Number(lowStockThreshold),
        description: description.trim(),
        image_url: imageUrl.trim(),
        badge: badge.trim() || null,
        dietary_tags: dietaryTags,
        status,
        is_featured: isFeatured,
        has_variants: hasVariants,
        variant_title: hasVariants ? variantTitle.trim() : undefined,
        variants: hasVariants ? variants : []
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      try {
        await api.deleteProduct(id);
        loadData();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, pageSize]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = categoryFilter ? p.category_id === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
            Products Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your store's live grocery inventory, pricing, variants, and stock levels
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#fed100]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-64 sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search product name or SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#3b711e]"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Entries per page (Requirement 1) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
            <span className="font-semibold text-stone-500">Show:</span>
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-stone-500">
          Showing <strong className="text-stone-900">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredProducts.length)}</strong> of <strong className="text-stone-900">{filteredProducts.length}</strong> Products
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-bold uppercase">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-100">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price / Unit</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginatedProducts.map(p => {
                    const cat = categories.find(c => c.id === p.category_id);
                    const isLow = p.stock_quantity <= p.low_stock_threshold;

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-stone-50 p-1 shrink-0 border border-stone-100 flex items-center justify-center">
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 flex items-center gap-1.5 flex-wrap">
                                <span>{p.name}</span>
                                {p.has_variants && p.variants && p.variants.length > 0 && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    <Layers className="w-2.5 h-2.5" />
                                    {p.variants.length} Variants
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-stone-400">
                                {p.brand} • <span className="font-mono">{p.sku}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                            {cat?.name || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {p.has_variants ? 'From ' : ''}₹{p.discount_price ?? p.price}{' '}
                          <span className="text-[10px] text-stone-400 font-normal">/ {p.unit}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              p.stock_quantity === 0
                                ? 'bg-red-100 text-red-700'
                                : isLow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {p.stock_quantity} in stock
                          </span>
                        </td>
                        <td className="py-3 px-4 capitalize">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              p.status === 'published'
                                ? 'bg-[#eaf4e6] text-[#2d5c16]'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (Requirement 1) */}
            <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
              <div>
                Showing <strong className="text-stone-900">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to <strong className="text-stone-900">{Math.min(currentPage * pageSize, filteredProducts.length)}</strong> of <strong className="text-stone-900">{filteredProducts.length}</strong> items
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    if (totalPages > 7 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                      if (Math.abs(pageNum - currentPage) === 3) {
                        return <span key={pageNum} className="px-1 text-stone-400">...</span>;
                      }
                      return null;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors shadow-2xs ${
                          currentPage === pageNum
                            ? 'bg-[#0d1f15] text-white'
                            : 'border border-stone-300 bg-white hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* EMPTY CATALOG NOTICE */
          <div className="p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#f4f7f2] text-[#3b711e] flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base font-serif font-black text-stone-900 mb-1">
              No products in catalog yet
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              In accordance with Zero Demo Products requirements, your database starts completely clean. Add products using the button below.
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4 text-[#fed100]" />
              <span>Add First Product</span>
            </button>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <h2 className="text-lg font-serif font-black text-[#0d1f15]">
                {editingProduct ? 'Edit Grocery Item' : 'Add New Grocery Product'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Fresh Shimla Apples"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Department / Category *</label>
                  <select
                    required
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Brand & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    placeholder="e.g. VillageDELI Fresh"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Price, Discount Price, Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="120"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={discountPrice}
                    onChange={e => setDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="99 (optional)"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unit *</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="e.g. 500g, 1 kg, 1 pc"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              {/* Row 4: Stock & Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {hasVariants ? 'Total Combined Stock' : 'Stock Quantity *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    disabled={hasVariants}
                    value={hasVariants ? variants.reduce((sum, v) => sum + v.stock_quantity, 0) : stockQuantity}
                    onChange={e => setStockQuantity(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border border-stone-300 ${hasVariants ? 'bg-stone-100 text-stone-500 cursor-not-allowed' : ''}`}
                  />
                  {hasVariants && (
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Auto-calculated from variant quantities below
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Low Stock Alert Below</label>
                  <input
                    type="number"
                    min={1}
                    value={lowStockThreshold}
                    onChange={e => setLowStockThreshold(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              {/* Row 4.5: Multiple Variants Option (Requirement 4) */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasVariants}
                      onChange={e => {
                        const checked = e.target.checked;
                        setHasVariants(checked);
                        if (checked && variants.length === 0) {
                          setVariants([
                            {
                              id: 'var_' + Date.now() + '_1',
                              name: '500g',
                              price: Number(price) || 60,
                              stock_quantity: 25,
                              is_available: true
                            },
                            {
                              id: 'var_' + Date.now() + '_2',
                              name: '1 kg',
                              price: (Number(price) || 60) * 1.9,
                              stock_quantity: 25,
                              is_available: true
                            }
                          ]);
                        }
                      }}
                      className="w-4 h-4 text-[#3b711e] rounded focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-stone-900">
                      Enable Product Variants (e.g., 500g, 1 kg, 2 kg)
                    </span>
                  </label>
                </div>

                {hasVariants && (
                  <div className="space-y-3 pt-3 border-t border-stone-200">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Variant Option Name (e.g. Pack Size, Weight, Size)
                      </label>
                      <input
                        type="text"
                        value={variantTitle}
                        onChange={e => setVariantTitle(e.target.value)}
                        placeholder="e.g. Pack Size"
                        className="w-full sm:w-64 p-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-stone-700 flex justify-between items-center">
                        <span>Individual Variant Options & Dedicated Stock:</span>
                        <span className="text-[10px] text-stone-500 font-normal">Each variant maintains separate stock</span>
                      </div>

                      {variants.map((v, idx) => (
                        <div
                          key={v.id}
                          className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-xl border border-stone-200 shadow-2xs"
                        >
                          <div className="col-span-5 sm:col-span-4">
                            <span className="text-[10px] font-bold text-stone-500 block mb-0.5">Option Name *</span>
                            <input
                              type="text"
                              required
                              value={v.name}
                              onChange={e => {
                                const updated = [...variants];
                                updated[idx].name = e.target.value;
                                setVariants(updated);
                              }}
                              placeholder="e.g. 500g"
                              className="w-full text-xs font-semibold p-2 border border-stone-300 rounded-lg"
                            />
                          </div>

                          <div className="col-span-3 sm:col-span-3">
                            <span className="text-[10px] font-bold text-stone-500 block mb-0.5">Price (₹) *</span>
                            <input
                              type="number"
                              required
                              min={0}
                              value={v.price}
                              onChange={e => {
                                const updated = [...variants];
                                updated[idx].price = Number(e.target.value);
                                setVariants(updated);
                              }}
                              className="w-full text-xs font-semibold p-2 border border-stone-300 rounded-lg"
                            />
                          </div>

                          <div className="col-span-3 sm:col-span-3">
                            <span className="text-[10px] font-bold text-stone-500 block mb-0.5">Stock Qty *</span>
                            <input
                              type="number"
                              required
                              min={0}
                              value={v.stock_quantity}
                              onChange={e => {
                                const updated = [...variants];
                                updated[idx].stock_quantity = Number(e.target.value);
                                setVariants(updated);
                              }}
                              className="w-full text-xs font-semibold p-2 border border-stone-300 rounded-lg"
                            />
                          </div>

                          <div className="col-span-1 sm:col-span-2 flex justify-end pt-4">
                            <button
                              type="button"
                              onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                              disabled={variants.length <= 1}
                              className="text-stone-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-stone-400 p-1.5 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete variant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setVariants([
                            ...variants,
                            {
                              id: 'var_' + Date.now() + '_' + (variants.length + 1),
                              name: '',
                              price: Number(price) || 0,
                              stock_quantity: 20,
                              is_available: true
                            }
                          ]);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3b711e] hover:text-[#2d5c16] mt-2 py-1.5 px-3.5 rounded-lg border border-[#3b711e]/30 bg-white hover:bg-[#eef5ea] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Another Variant Row</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload & Preview */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Image *</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-stone-200 bg-stone-50">
                  <div className="w-20 h-20 rounded-xl bg-white border border-stone-200 p-2 flex items-center justify-center shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt="preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-stone-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white border border-stone-300 hover:border-stone-400 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-700">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      <span className="text-stone-400 text-[10px]">or enter direct image URL</span>
                    </div>

                    <input
                      type="text"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="/assets/cat_fresh_produce.webp or https://..."
                      className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Badge & Dietary Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Promo Badge</label>
                  <select
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="">None</option>
                    <option value="Farm Fresh">Farm Fresh</option>
                    <option value="Organic">Organic</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New Harvest">New Harvest</option>
                    <option value="Special Offer">Special Offer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="published">Published (Visible in Store)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Dietary & Attributes</label>
                <div className="flex flex-wrap gap-2">
                  {['Organic', 'Farm Fresh', 'Gluten Free', 'Dairy Free', 'Vegan', 'Sugar Free'].map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleDietaryTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        dietaryTags.includes(tag)
                          ? 'bg-[#3b711e] text-white border-[#3b711e]'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Freshly sourced directly from verified regional growers..."
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-[#0d1f15] hover:bg-[#173323] text-white font-bold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
