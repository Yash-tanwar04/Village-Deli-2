import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  Crop,
  RotateCcw,
  Check,
  AlertCircle,
  MessageSquareQuote,
  Sparkles,
  Info,
  ZoomIn,
  Move
} from 'lucide-react';
import {
  Testimonial,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  resetTestimonialsToDefault
} from '../../lib/testimonialsStore';

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'career' | 'farmer' | 'customer'>('all');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState<'career' | 'farmer' | 'customer'>('career');
  const [quote, setQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  // Interactive Crop & Framing Tool State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0); // in percent (-100 to 100)
  const [panY, setPanY] = useState(0); // in percent (-100 to 100)
  const [isCroppingOpen, setIsCroppingOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadList();
    const handleUpdate = () => loadList();
    window.addEventListener('villagedeli:testimonials-updated', handleUpdate);
    return () => window.removeEventListener('villagedeli:testimonials-updated', handleUpdate);
  }, []);

  const loadList = () => {
    setLoading(true);
    const data = getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  const filteredItems = selectedCategory === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === selectedCategory);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setRole('');
    setCategory('career');
    setQuote('');
    setImageUrl('/assets/mockup/career_priya_sharma.webp');
    setSourceImage(null);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setIsCroppingOpen(false);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setName(item.name);
    setRole(item.role);
    setCategory(item.category);
    setQuote(item.quote);
    setImageUrl(item.image);
    setSourceImage(item.image);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setIsCroppingOpen(false);
    setFormError('');
    setModalOpen(true);
  };

  const handleDelete = (id: string, testName: string) => {
    if (window.confirm(`Are you sure you want to delete testimonial from "${testName}"?`)) {
      deleteTestimonial(id);
      loadList();
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all testimonials to default factory data? This will restore all standard team and farmer quotes.')) {
      resetTestimonialsToDefault();
      loadList();
    }
  };

  // Image Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please upload an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSourceImage(dataUrl);
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setIsCroppingOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Render crop onto canvas for real-time preview & output
  useEffect(() => {
    if (!sourceImage || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceImage;
    img.onload = () => {
      // 800x800 high definition square
      canvas.width = 800;
      canvas.height = 800;

      ctx.clearRect(0, 0, 800, 800);
      ctx.fillStyle = '#f5f5f4';
      ctx.fillRect(0, 0, 800, 800);

      // Determine dimensions
      const aspect = img.width / img.height;
      let drawW: number;
      let drawH: number;

      if (aspect > 1) {
        drawH = 800 * zoom;
        drawW = drawH * aspect;
      } else {
        drawW = 800 * zoom;
        drawH = drawW / aspect;
      }

      // Calculate centering + pan offsets
      const centerX = (800 - drawW) / 2 + (panX / 100) * (drawW / 2);
      const centerY = (800 - drawH) / 2 + (panY / 100) * (drawH / 2);

      ctx.drawImage(img, centerX, centerY, drawW, drawH);
    };
  }, [sourceImage, zoom, panX, panY, isCroppingOpen]);

  // Apply Crop & Save to Image URL
  const handleApplyCrop = () => {
    if (!previewCanvasRef.current) return;
    try {
      const croppedDataUrl = previewCanvasRef.current.toDataURL('image/webp', 0.92);
      setImageUrl(croppedDataUrl);
      setIsCroppingOpen(false);
    } catch (e) {
      console.warn('Canvas export error:', e);
      if (sourceImage) setImageUrl(sourceImage);
      setIsCroppingOpen(false);
    }
  };

  // Drag interaction on crop preview
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    // Sensitivity adjusted
    setPanX(prev => Math.max(-100, Math.min(100, prev + (dx / 2))));
    setPanY(prev => Math.max(-100, Math.min(100, prev + (dy / 2))));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Name is required.');
      return;
    }
    if (!role.trim()) {
      setFormError('Role or Location is required (e.g. "Store Manager, Gurugram" or "Organic Farmer, Punjab").');
      return;
    }
    if (!quote.trim()) {
      setFormError('Quote is required.');
      return;
    }
    if (!imageUrl.trim()) {
      setFormError('Photo image is required. Please upload or specify an image URL.');
      return;
    }

    try {
      saveTestimonial({
        id: editingItem?.id,
        name: name.trim(),
        role: role.trim(),
        category,
        quote: quote.trim(),
        image: imageUrl.trim()
      });
      setModalOpen(false);
      loadList();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save testimonial');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-[#eef5ea] text-[#2d5c16] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#6cb33f]" />
              Social Proof & Trust
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
            Testimonials & Partner Stories
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage team, farmer partner, and customer reviews displayed across the website
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            title="Reset to factory testimonials"
            className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Restore Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#fed100]" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* RESOLUTION SPECIFICATION & GUIDANCE BANNER */}
      <div className="bg-[#f7faf5] border border-[#6cb33f]/30 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#eef5ea] border border-[#6cb33f]/40 text-[#2d5c16] flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-5 h-5 text-[#3b711e]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0d1f15] flex items-center gap-2">
              <span>Card Image Resolution & Aspect Ratio Guidelines</span>
              <span className="bg-[#6cb33f] text-[#0d1f15] text-[9px] font-black px-2 py-0.5 rounded-full">
                1:1 SQUARE
              </span>
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              For crisp display on high-density screens, use pictures with an exact <strong>1:1 Square aspect ratio</strong>.
              Recommended resolution: <strong className="text-stone-900 font-mono">800 × 800 px</strong> (Minimum: <span className="font-mono">400 × 400 px</span>).
              Supported formats: <strong>JPG, PNG, WebP</strong> (Max 2MB).
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-center text-xs space-y-0.5 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-stone-400">Target Card Fit</div>
          <div className="font-mono font-bold text-[#0d1f15] text-sm">800 × 800 px</div>
          <div className="text-[10px] text-[#3b711e] font-semibold">Interactive Crop Enabled</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        {[
          { key: 'all', label: `All Testimonials (${testimonials.length})` },
          { key: 'career', label: `Careers & Team (${testimonials.filter(t => t.category === 'career').length})` },
          { key: 'farmer', label: `Farmers & Producers (${testimonials.filter(t => t.category === 'farmer').length})` },
          { key: 'customer', label: `Customers & Club (${testimonials.filter(t => t.category === 'customer').length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedCategory(tab.key as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === tab.key
                ? 'bg-[#0d1f15] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Testimonials */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500 font-bold uppercase tracking-widest">
          Loading testimonials...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <MessageSquareQuote className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">No testimonials in this category</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click "Add Testimonial" above to create one, or restore the default factory quotes.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 bg-[#0d1f15] text-white text-xs font-bold px-4 py-2 rounded-full"
          >
            <Plus className="w-3.5 h-3.5 text-[#fed100]" />
            <span>Add Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                {/* Category Badge & Actions */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      item.category === 'farmer'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.category === 'career'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.category === 'farmer'
                      ? 'Farmer Partner'
                      : item.category === 'career'
                      ? 'Team / Career'
                      : 'Customer / Club'}
                  </span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(item)}
                      title="Edit Testimonial & Crop Photo"
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      title="Delete Testimonial"
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-xs text-stone-700 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info with 1:1 Avatar Picture */}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#6cb33f]/40 bg-stone-100 shrink-0 shadow-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/mockup/career_priya_sharma.webp';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#0d1f15] truncate">{item.name}</h4>
                  <p className="text-[10px] text-stone-500 font-medium truncate">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD / EDIT TESTIMONIAL MODAL WITH INTERACTIVE CROPPER */}
      {/* ============================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif font-black text-xl text-[#0d1f15]">
                  {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <p className="text-xs text-stone-500">
                  Fill in the author details, quote, and upload or crop an image
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Name and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Author Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Yadav or Priya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-hidden bg-white"
                  >
                    <option value="career">Careers & Team (Shown on /careers)</option>
                    <option value="farmer">Farmers & Producers (Shown on /source)</option>
                    <option value="customer">Customer & Club (Shown on /club & Home)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Role / Designation / Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Role / Designation & Location *
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Store Manager, Gurugram or Organic Vegetable Farmer, Haryana"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-hidden"
                  required
                />
              </div>

              {/* Row 3: Quote */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Write the testimonial or feedback statement here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-hidden"
                  required
                />
              </div>

              {/* Row 4: Photo & Interactive Cropper Section */}
              <div className="bg-[#fafaf7] rounded-2xl border border-stone-200 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#0d1f15] block">
                      Author Photo & Framing
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Recommended: <strong>800 × 800 px (1:1 Square)</strong>, Min 400 × 400 px, Max 2MB
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-100 text-[#0d1f15] text-xs font-bold px-3.5 py-1.5 rounded-full border border-stone-200 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#3b711e]" />
                      <span>Upload & Crop</span>
                    </button>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setSourceImage(imageUrl);
                          setIsCroppingOpen(!isCroppingOpen);
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#eef5ea] hover:bg-[#e2edd9] text-[#2d5c16] text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>{isCroppingOpen ? 'Hide Cropper' : 'Crop Current'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct Image URL fallback / manual edit */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Image URL (or use Upload & Crop above)
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setSourceImage(e.target.value);
                    }}
                    placeholder="/assets/mockup/career_priya_sharma.webp or https://..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:ring-2 focus:ring-[#6cb33f] focus:outline-hidden font-mono text-[11px]"
                  />
                </div>

                {/* INTERACTIVE CROP / FRAMING WORKSPACE */}
                {isCroppingOpen && (
                  <div className="bg-white rounded-2xl border-2 border-[#6cb33f]/40 p-4 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0d1f15] flex items-center gap-1.5">
                        <Crop className="w-4 h-4 text-[#3b711e]" />
                        Interactive Framing & Aspect Tool (1:1 Target)
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        Drag inside preview to reposition
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      {/* Interactive Canvas Box with Drag */}
                      <div className="relative aspect-square max-w-[240px] mx-auto w-full bg-stone-100 rounded-xl overflow-hidden border border-stone-300 shadow-inner cursor-grab active:cursor-grabbing select-none"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        <canvas
                          ref={previewCanvasRef}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay square target guide */}
                        <div className="absolute inset-0 border-2 border-white/80 pointer-events-none rounded-xl" />
                        <div className="absolute inset-2 border border-dashed border-[#6cb33f]/80 pointer-events-none rounded-full" />
                        <div className="absolute bottom-1 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono pointer-events-none">
                          800×800
                        </div>
                      </div>

                      {/* Controls & Realtime Previews */}
                      <div className="space-y-3.5">
                        {/* Zoom Slider */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                            <span className="flex items-center gap-1">
                              <ZoomIn className="w-3.5 h-3.5 text-stone-500" />
                              Zoom Level
                            </span>
                            <span className="font-mono text-[11px]">{Math.round(zoom * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full accent-[#3b711e] cursor-pointer"
                          />
                        </div>

                        {/* Horizontal Pan */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                            <span className="flex items-center gap-1">
                              <Move className="w-3.5 h-3.5 text-stone-500" />
                              Pan Horizontal
                            </span>
                            <span className="font-mono text-[11px]">{Math.round(panX)}%</span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={panX}
                            onChange={(e) => setPanX(parseFloat(e.target.value))}
                            className="w-full accent-[#3b711e] cursor-pointer"
                          />
                        </div>

                        {/* Vertical Pan */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                            <span>Pan Vertical</span>
                            <span className="font-mono text-[11px]">{Math.round(panY)}%</span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={panY}
                            onChange={(e) => setPanY(parseFloat(e.target.value))}
                            className="w-full accent-[#3b711e] cursor-pointer"
                          />
                        </div>

                        {/* Apply & Reset Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleApplyCrop}
                            className="flex-1 bg-[#0d1f15] hover:bg-[#1a3d2b] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-[#6cb33f]" />
                            <span>Apply Crop & Use</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setZoom(1);
                              setPanX(0);
                              setPanY(0);
                            }}
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                            title="Reset pan & zoom"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Avatar & Card Preview */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#6cb33f] bg-stone-200 shrink-0 shadow-xs">
                      <img
                        src={imageUrl || '/assets/mockup/career_priya_sharma.webp'}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/mockup/career_priya_sharma.webp';
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase">Live Avatar</div>
                      <div className="text-xs font-bold text-stone-800">Circular Fit</div>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-stone-200" />

                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-300 bg-stone-200 shrink-0 shadow-xs">
                      <img
                        src={imageUrl || '/assets/mockup/career_priya_sharma.webp'}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/mockup/career_priya_sharma.webp';
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase">Live Card</div>
                      <div className="text-xs font-bold text-stone-800">1:1 Square Fit</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0d1f15] hover:bg-[#1a3d2b] text-white transition-all shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
