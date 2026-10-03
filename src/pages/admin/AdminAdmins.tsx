import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Trash2,
  Lock,
  Mail,
  User,
  AlertCircle,
  X,
  CheckCircle,
  Search,
  KeyRound,
  Store,
  Edit2
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, StoreLocation } from '../../types';

export const AdminAdmins: React.FC = () => {
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<UserProfile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // New Admin Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin');
  const [phone, setPhone] = useState('');
  const [assignedStores, setAssignedStores] = useState<string[]>([]);

  // Edit Admin Form
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'super_admin'>('admin');
  const [editPassword, setEditPassword] = useState('');
  const [editAssignedStores, setEditAssignedStores] = useState<string[]>([]);

  const { user: currentAdmin, isSuperAdmin } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adminsData, storesData] = await Promise.all([
        api.getAdmins(),
        api.getStores(true)
      ]);
      setAdmins(adminsData);
      setStores(storesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrator accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await api.createAdmin({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim(),
        assigned_store_ids: assignedStores
      });
      setSuccessMsg(`Administrator account for ${fullName} created successfully.`);
      setModalOpen(false);
      resetForm();
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create administrator');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (admin: UserProfile) => {
    setEditingAdmin(admin);
    setEditFullName(admin.full_name);
    setEditPhone(admin.phone || '');
    setEditRole(admin.role === 'super_admin' ? 'super_admin' : 'admin');
    setEditPassword('');
    setEditAssignedStores(admin.assigned_store_ids || []);
    setError('');
    setEditModalOpen(true);
  };

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await api.updateAdmin(editingAdmin.id, {
        full_name: editFullName.trim(),
        phone: editPhone.trim(),
        role: editRole,
        password: editPassword.trim() ? editPassword : undefined,
        assigned_store_ids: editAssignedStores
      });
      setSuccessMsg(`Administrator ${editFullName} updated successfully.`);
      setEditModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update administrator');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deleteTarget) return;
    setError('');
    setDeleteSubmitting(true);

    try {
      const res = await api.deleteAdmin(deleteTarget.id);
      if (res.success) {
        setSuccessMsg(`Administrator ${deleteTarget.full_name} has been removed.`);
        setDeleteTarget(null);
        await loadData();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove administrator');
      setDeleteTarget(null);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('admin');
    setPhone('');
    setAssignedStores([]);
  };

  const superAdminsCount = admins.filter((a: UserProfile) => a.role === 'super_admin').length;

  const filtered = admins.filter(
    (a: UserProfile) =>
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15] flex items-center gap-2.5">
            <span>Store Administrators</span>
            <span className="text-xs font-sans font-bold bg-[#fed100]/20 text-[#0d1f15] border border-[#fed100]/40 px-2.5 py-0.5 rounded-full">
              {admins.length} Total
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage administrative accounts, role permissions, and access credentials
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search admins..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] bg-white"
            />
          </div>

          <button
            onClick={() => {
              setError('');
              resetForm();
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#fed100]" />
            <span>Add Admin</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="p-1 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="p-1 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-bold uppercase">Loading administrator directory...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-100">
                <tr>
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Role & Access</th>
                  <th className="py-3.5 px-4">Assigned Store(s)</th>
                  <th className="py-3.5 px-4">Added Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((admin: UserProfile) => {
                  const isCurrent = currentAdmin?.id === admin.id;
                  const isOnlySuperAdmin = admin.role === 'super_admin' && superAdminsCount <= 1;

                  return (
                    <tr key={admin.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            admin.role === 'super_admin'
                              ? 'bg-[#fed100]/20 text-[#856404] border border-[#fed100]'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {admin.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 flex items-center gap-2">
                              <span>{admin.full_name}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-bold bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-md">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono">
                              {admin.phone || 'No phone recorded'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-stone-800">
                        {admin.email}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                            admin.role === 'super_admin'
                              ? 'bg-[#0d1f15] text-[#fed100] border border-[#fed100]/30'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {admin.role === 'super_admin' ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-[#fed100]" />
                              <span>Super Admin</span>
                            </>
                          ) : (
                            <>
                              <KeyRound className="w-3 h-3 text-emerald-600" />
                              <span>Admin</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {admin.role === 'super_admin' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Store className="w-3 h-3 text-emerald-600" />
                            <span>All Outlets (Super Admin)</span>
                          </span>
                        ) : admin.assigned_store_ids && admin.assigned_store_ids.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {admin.assigned_store_ids.map((sId: string) => {
                              const storeObj = stores.find((s: StoreLocation) => s.id === sId);
                              return (
                                <span
                                  key={sId}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200"
                                >
                                  <Store className="w-2.5 h-2.5 text-stone-500" />
                                  <span>{storeObj?.name.replace('VillageDELI – ', '') || sId}</span>
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-400 italic">No store assigned</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-stone-500">
                        {admin.created_at ? new Date(admin.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(admin)}
                            className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                            title="Edit Administrator"
                          >
                            <Edit2 className="w-3 h-3 text-stone-500" />
                            <span>Edit</span>
                          </button>

                          {isOnlySuperAdmin ? (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] text-stone-400 italic bg-stone-100 px-2 py-1 rounded-lg"
                              title="Cannot remove the only Super Admin"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
                            </span>
                          ) : (
                            <button
                              onClick={() => setDeleteTarget(admin)}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                              title="Remove Administrator"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-stone-500">
            No administrators found matching your search.
          </div>
        )}
      </div>

      {/* CREATE ADMIN MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-stone-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 p-1 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#0d1f15] text-[#fed100] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-[#0d1f15]">
                  Add Administrator
                </h3>
                <p className="text-xs text-stone-500">
                  Provision new credentials with role-based access
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rajesh@villagedeli.in"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Initial Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Access Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] bg-white font-medium"
                >
                  <option value="admin">Admin — Catalog, Orders, Customers & Analytics</option>
                  <option value="super_admin" disabled={!isSuperAdmin}>
                    Super Admin — Full system authority & Admin Management {!isSuperAdmin && '(Requires Super Admin)'}
                  </option>
                </select>
              </div>

              {/* Store Assignment Checklist in Create Modal */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Assign Store Locations (Order Email Alerts)
                </label>
                <p className="text-[10px] text-stone-400">
                  Orders placed for or routed through these stores will notify this admin.
                </p>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
                  {stores.map((st: StoreLocation) => {
                    const isChecked = assignedStores.includes(st.id);
                    return (
                      <label
                        key={st.id}
                        className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer text-xs transition-colors border ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setAssignedStores((prev: string[]) =>
                              prev.includes(st.id) ? prev.filter((id: string) => id !== st.id) : [...prev, st.id]
                            );
                          }}
                          className="rounded text-[#6cb33f] focus:ring-[#6cb33f]"
                        />
                        <span className="truncate">{st.name}</span>
                        {st.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-normal">
                            {st.badge}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADMIN MODAL */}
      {editModalOpen && editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute right-5 top-5 p-1 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#0d1f15] text-[#fed100] flex items-center justify-center">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-[#0d1f15]">
                  Edit Administrator
                </h3>
                <p className="text-xs text-stone-500">
                  Update privileges and store assignments for {editingAdmin.email}
                </p>
              </div>
            </div>

            <form onSubmit={handleEditAdmin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={e => setEditFullName(e.target.value)}
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address (Read-only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={editingAdmin.email}
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  New Password (leave blank to keep unchanged)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={editPassword}
                    onChange={e => setEditPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Access Role
                </label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value as any)}
                  disabled={!isSuperAdmin && editingAdmin.role === 'super_admin'}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] bg-white font-medium disabled:bg-stone-100"
                >
                  <option value="admin">Admin — Store Management & Orders</option>
                  <option value="super_admin" disabled={!isSuperAdmin}>
                    Super Admin — Full system authority {!isSuperAdmin && '(Requires Super Admin)'}
                  </option>
                </select>
              </div>

              {/* Store Assignment Checklist in Edit Modal */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Assigned Store Outlets (Direct Order Email Routing)
                </label>
                <p className="text-[10px] text-stone-400">
                  Select which store(s) this admin manages. Whenever an order is assigned to these stores, this admin receives an alert email.
                </p>
                <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
                  {stores.map((st: StoreLocation) => {
                    const isChecked = editAssignedStores.includes(st.id);
                    return (
                      <label
                        key={st.id}
                        className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer text-xs transition-colors border ${
                          isChecked
                            ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setEditAssignedStores((prev: string[]) =>
                              prev.includes(st.id) ? prev.filter((id: string) => id !== st.id) : [...prev, st.id]
                            );
                          }}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="truncate">{st.name}</span>
                        {st.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-normal">
                            {st.badge}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0d1f15] hover:bg-[#173323] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL (Requirements 6 & 7) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border border-stone-200 animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-serif font-black text-stone-900 mb-2">
              Remove this administrator?
            </h3>

            <p className="text-xs text-stone-600 mb-6 leading-relaxed">
              This will revoke all administrative access for <strong className="text-stone-900">{deleteTarget.full_name}</strong> ({deleteTarget.email}). Their privileges will be immediately terminated.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={handleDeleteAdmin}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {deleteSubmitting ? 'Revoking...' : 'REMOVE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
