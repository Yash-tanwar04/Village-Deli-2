import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Search,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import { api } from '../../lib/api';
import { StoreLocation, UserProfile } from '../../types';

export const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [pickupFilter, setPickupFilter] = useState('all');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<StoreLocation | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [format, setFormat] = useState('Neighbourhood');
  const [badge, setBadge] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [state, setState] = useState('Haryana');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hours, setHours] = useState('Open 24 Hours (7 Days a Week)');
  const [manager, setManager] = useState('');
  const [parking, setParking] = useState('Yes');
  const [image, setImage] = useState('');
  const [iconsInput, setIconsInput] = useState('Fresh Produce, Fresh Food, Groceries');
  const [isActive, setIsActive] = useState(true);
  const [allowPickup, setAllowPickup] = useState(true);
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [storesData, adminsData] = await Promise.all([
        api.getStores(true),
        api.getAdmins()
      ]);
      setStores(storesData);
      setAdmins(adminsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingStore(null);
    setName('');
    setFormat('Neighbourhood');
    setBadge('Neighbourhood Store');
    setAddress('');
    setPincode('');
    setCity('Gurugram');
    setState('Haryana');
    setPhone('');
    setEmail('');
    setHours('Open 24 Hours (7 Days a Week)');
    setManager('');
    setParking('Yes');
    setImage('/assets/mockup/store_sector_109_card.webp');
    setIconsInput('Fresh Produce, Fresh Food, Groceries');
    setIsActive(true);
    setAllowPickup(true);
    setSelectedAdminIds([]);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (store: StoreLocation) => {
    setEditingStore(store);
    setName(store.name);
    setFormat(store.format || 'Neighbourhood');
    setBadge(store.badge || '');
    setAddress(store.address);
    setPincode(store.pincode);
    setCity(store.city);
    setState(store.state || '');
    setPhone(store.phone || '');
    setEmail(store.email || '');
    setHours(store.hours || 'Open 24 Hours (7 Days a Week)');
    setManager(store.manager || '');
    setParking(store.parking || 'Yes');
    setImage(store.image || '');
    setIconsInput((store.icons || []).join(', '));
    setIsActive(Boolean(store.is_active));
    setAllowPickup(Boolean(store.allow_pickup));
    setSelectedAdminIds(store.assigned_admin_ids || []);
    setError('');
    setModalOpen(true);
  };

  const toggleAdminSelection = (adminId: string) => {
    setSelectedAdminIds(prev =>
      prev.includes(adminId) ? prev.filter(id => id !== adminId) : [...prev, adminId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim() || !address.trim() || !pincode.trim()) {
      setError('Store name, address, and PIN code are required.');
      return;
    }

    setSubmitting(true);
    try {
      const iconsArray = iconsInput
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);

      const storePayload: Partial<StoreLocation> = {
        name: name.trim(),
        format: format as any,
        badge: badge.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
        city: city.trim(),
        state: state.trim(),
        phone: phone.trim(),
        email: email.trim(),
        hours: hours.trim(),
        manager: manager.trim(),
        parking: parking.trim(),
        image: image.trim() || '/assets/mockup/store_sector_109_card.webp',
        icons: iconsArray.length > 0 ? iconsArray : ['Fresh Produce', 'Groceries'],
        is_active: isActive,
        allow_pickup: allowPickup,
        assigned_admin_ids: selectedAdminIds
      };

      if (editingStore) {
        await api.updateStore(editingStore.id, storePayload);
        setSuccessMsg(`Store "${name}" updated successfully.`);
      } else {
        await api.createStore(storePayload);
        setSuccessMsg(`New store "${name}" created successfully.`);
      }

      setModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to save store location');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      await api.deleteStore(deleteTarget.id);
      setSuccessMsg(`Store "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete store');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleToggleActive = async (store: StoreLocation) => {
    try {
      await api.updateStore(store.id, { is_active: !store.is_active });
      setStores(prev =>
        prev.map(s => (s.id === store.id ? { ...s, is_active: !store.is_active } : s))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update store status');
    }
  };

  const handleTogglePickup = async (store: StoreLocation) => {
    try {
      await api.updateStore(store.id, { allow_pickup: !store.allow_pickup });
      setStores(prev =>
        prev.map(s => (s.id === store.id ? { ...s, allow_pickup: !store.allow_pickup } : s))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update store pickup option');
    }
  };

  // Filtered stores
  const filtered = stores.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.pincode.includes(q) ||
      (s.manager && s.manager.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q));

    const matchesFormat = formatFilter === 'all' || s.format === formatFilter;
    const matchesPickup =
      pickupFilter === 'all' ||
      (pickupFilter === 'enabled' && s.allow_pickup) ||
      (pickupFilter === 'disabled' && !s.allow_pickup);

    return matchesSearch && matchesFormat && matchesPickup;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedStores = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-[#0d1f15] text-[#6cb33f] flex items-center justify-center shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
              Store Locations & Pickup Hubs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
            Configure retail store branches, self-pickup availability, store operational emails, and assigned admin staff for direct order alerts.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0d1f15] hover:bg-[#1a3826] text-[#6cb33f] hover:text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Store</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stat Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold mb-1">
            Total Outlets
          </div>
          <div className="text-2xl font-serif font-black text-stone-900">
            {stores.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-stone-400" />
            <span>Network branches</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-bold mb-1">
            Pickup Enabled
          </div>
          <div className="text-2xl font-serif font-black text-emerald-700">
            {stores.filter(s => s.allow_pickup && s.is_active).length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ready for customers</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-bold mb-1">
            24/7 Hours
          </div>
          <div className="text-2xl font-serif font-black text-blue-700">
            {stores.filter(s => s.hours?.toLowerCase().includes('24')).length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Round-the-clock</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-purple-600 font-bold mb-1">
            Assigned Admins
          </div>
          <div className="text-2xl font-serif font-black text-purple-700">
            {admins.filter(a => a.assigned_store_ids && a.assigned_store_ids.length > 0).length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            <span>Direct alert receivers</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search stores by name, PIN, manager..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#6cb33f] focus:border-[#6cb33f]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Format Filter */}
          <select
            value={formatFilter}
            onChange={e => {
              setFormatFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
          >
            <option value="all">All Formats</option>
            <option value="Neighbourhood">Neighbourhood</option>
            <option value="VillageDELI Hub">VillageDELI Hub</option>
            <option value="Highway Travel Plaza">Highway Travel Plaza</option>
          </select>

          {/* Pickup Filter */}
          <select
            value={pickupFilter}
            onChange={e => {
              setPickupFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
          >
            <option value="all">All Pickup Status</option>
            <option value="enabled">Pickup Enabled</option>
            <option value="disabled">Pickup Disabled</option>
          </select>

          {/* Page size */}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Stores List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <div className="w-8 h-8 border-2 border-stone-400 border-t-[#6cb33f] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500 font-mono">Loading store locations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <Store className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-stone-700">No store locations match your filters</p>
          <p className="text-xs text-stone-400 mt-1">Try resetting your search or format criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedStores.map(store => {
            const assignedStoreAdmins = admins.filter(a =>
              store.assigned_admin_ids?.includes(a.id)
            );

            return (
              <div
                key={store.id}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                  store.is_active ? 'border-stone-200' : 'border-red-200 bg-stone-50/70'
                }`}
              >
                <div>
                  {/* Card Header & Badge */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0d1f15] text-[#6cb33f]">
                        {store.badge || store.format || 'Store'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleActive(store)}
                          title={store.is_active ? 'Active Store (Click to disable)' : 'Inactive Store (Click to activate)'}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                            store.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {store.is_active ? 'Active' : 'Disabled'}
                        </button>

                        <button
                          onClick={() => handleTogglePickup(store)}
                          title={store.allow_pickup ? 'Pickup Enabled' : 'Pickup Disabled'}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                            store.allow_pickup
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-stone-100 text-stone-500 border-stone-200'
                          }`}
                        >
                          {store.allow_pickup ? 'Pickup: Yes' : 'Pickup: No'}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-serif font-black text-stone-900 leading-snug line-clamp-1">
                      {store.name}
                    </h3>
                  </div>

                  {/* Address & Contact Info */}
                  <div className="px-5 space-y-2.5 text-xs text-stone-600 pb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">
                        {store.address} (PIN: <strong>{store.pincode}</strong>)
                      </span>
                    </div>

                    {store.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span className="font-mono">{store.phone}</span>
                      </div>
                    )}

                    {store.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span className="font-mono text-stone-700">{store.email}</span>
                      </div>
                    )}

                    {store.hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span>{store.hours}</span>
                      </div>
                    )}

                    {store.manager && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span>Manager: <strong>{store.manager}</strong></span>
                      </div>
                    )}

                    {/* Assigned Admins Badge */}
                    <div className="pt-2 border-t border-stone-100">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold mb-1.5 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span>Assigned Staff ({assignedStoreAdmins.length})</span>
                      </div>
                      {assignedStoreAdmins.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedStoreAdmins.map(adm => (
                            <span
                              key={adm.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-100 text-[10px] font-medium"
                            >
                              <span>{adm.full_name}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">
                          No direct store staff assigned (Main Super Admin receives alerts)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400">
                    ID: {store.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(store)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 transition-colors shadow-2xs"
                    >
                      <Edit2 className="w-3 h-3 text-stone-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(store)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Store"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between bg-white border border-stone-200 rounded-2xl px-5 py-3 shadow-sm">
          <div className="text-xs text-stone-500">
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> of{' '}
            <strong>{filtered.length}</strong> stores
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0d1f15] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#6cb33f]" />
                <h3 className="font-serif font-black text-lg">
                  {editingStore ? 'Edit Store Location' : 'Add New Store Location'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-grow text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Store Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="VillageDELI – Sector 109"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Store Format</label>
                  <select
                    value={format}
                    onChange={e => setFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  >
                    <option value="Neighbourhood">Neighbourhood Store</option>
                    <option value="VillageDELI Hub">VillageDELI Hub</option>
                    <option value="Highway Travel Plaza">Highway Travel Plaza</option>
                    <option value="Express">Express</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Badge Text (optional)</label>
                  <input
                    type="text"
                    placeholder="Flagship Hub / Neighbourhood"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="122017"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Full Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Plot 12, Sector 109, Gurugram, Haryana"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Store Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Store Notification Email</label>
                  <input
                    type="email"
                    placeholder="sec109@villagedeli.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                  <p className="text-[10px] text-stone-400">
                    Orders assigned to this store will send an instant email to this address.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Operating Hours</label>
                  <input
                    type="text"
                    placeholder="Open 24 Hours (7 Days a Week)"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Store Manager Name</label>
                  <input
                    type="text"
                    placeholder="Amit Sharma"
                    value={manager}
                    onChange={e => setManager(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Parking Facilities</label>
                  <input
                    type="text"
                    placeholder="Yes (100+ Cars & EV)"
                    value={parking}
                    onChange={e => setParking(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Store Card Image URL</label>
                  <input
                    type="text"
                    placeholder="/assets/mockup/store_sector_109_card.webp"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Offering Tags / Icons (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Fresh Produce, Fresh Food, Groceries, Bakery"
                  value={iconsInput}
                  onChange={e => setIconsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6cb33f]"
                />
              </div>

              {/* Assigned Admins Multi-Select */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="font-bold text-stone-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Assigned Administrators (Direct Email & Order Notification)</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">
                    {selectedAdminIds.length} selected
                  </span>
                </label>
                <p className="text-[10px] text-stone-500">
                  Select which admin users manage this store. These admins will automatically receive order notification emails whenever an order is placed for or near this store.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
                  {admins.map(adm => {
                    const checked = selectedAdminIds.includes(adm.id);
                    return (
                      <label
                        key={adm.id}
                        className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border text-xs ${
                          checked
                            ? 'bg-purple-50/80 border-purple-200 text-purple-900 font-semibold'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAdminSelection(adm.id)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <div className="truncate">
                          <div className="truncate">{adm.full_name}</div>
                          <div className="text-[10px] text-stone-400 font-mono truncate">{adm.email}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-3 border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#6cb33f] rounded focus:ring-[#6cb33f]"
                  />
                  <span className="font-bold text-stone-800">Store Active & Visible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowPickup}
                    onChange={e => setAllowPickup(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="font-bold text-emerald-800">Enable "Pickup from Store" Option</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#0d1f15] hover:bg-[#1a3826] text-[#6cb33f] hover:text-white rounded-full font-black uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingStore ? 'Update Store' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-serif font-black text-stone-900">
                Delete Store Location?
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Are you sure you want to permanently delete <strong>{deleteTarget.name}</strong>? Customers will no longer be able to select this store for order pickup.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteSubmitting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {deleteSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
