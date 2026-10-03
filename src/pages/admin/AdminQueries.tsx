import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  X,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../../lib/api';
import { SupportQuery } from '../../types';

export const AdminQueries: React.FC = () => {
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'closed'>('all');

  // Pagination (Requirement 1)
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selected Query for Chat / Thread view
  const [selectedQuery, setSelectedQuery] = useState<SupportQuery | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    setLoading(true);
    try {
      const data = await api.getSupportQueries();
      setQueries(data);
      if (selectedQuery) {
        const refreshed = data.find(q => q.id === selectedQuery.id);
        if (refreshed) setSelectedQuery(refreshed);
      }
    } catch (err) {
      console.error('Failed to load support queries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  const filteredQueries = queries.filter(q => {
    const qStatus = (q.status || '').toLowerCase().replace(/\s+/g, '-');
    const matchesStatus = statusFilter === 'all' ? true : qStatus === statusFilter;
    const term = searchQuery.toLowerCase().trim();
    const queryMsg = q.message || (q.messages && q.messages[0]?.message) || '';
    const ticketNum = q.ticket_number || q.id || '';
    const matchesSearch = term
      ? ticketNum.toLowerCase().includes(term) ||
        (q.name && q.name.toLowerCase().includes(term)) ||
        (q.email && q.email.toLowerCase().includes(term)) ||
        (q.phone && q.phone.includes(term)) ||
        (q.subject && q.subject.toLowerCase().includes(term)) ||
        queryMsg.toLowerCase().includes(term)
      : true;

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredQueries.length / pageSize) || 1;
  const paginatedQueries = filteredQueries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSendReply = async () => {
    if (!selectedQuery || !replyText.trim() || sendingReply) return;
    setSendingReply(true);
    try {
      const updated = await api.replySupportQuery(selectedQuery.id, replyText.trim(), 'Admin');
      setSelectedQuery(updated);
      setQueries(prev => prev.map(q => (q.id === updated.id ? updated : q)));
      setReplyText('');
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (queryId: string, newStatus: 'open' | 'in-progress' | 'resolved' | 'closed') => {
    setUpdatingStatus(true);
    try {
      const updated = await api.updateSupportQueryStatus(queryId, newStatus);
      setSelectedQuery(prev => (prev && prev.id === queryId ? updated : prev));
      setQueries(prev => prev.map(q => (q.id === queryId ? updated : q)));
    } catch (err: any) {
      alert(err.message || 'Failed to update query status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    switch (s) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-700" />
            <span>Open</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
            <Clock className="w-3 h-3 text-blue-700" />
            <span>In Progress</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-green-100 text-green-900 border border-green-300">
            <CheckCircle2 className="w-3 h-3 text-green-700" />
            <span>Resolved</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            <span>Closed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  const openCount = queries.filter(q => (q.status || '').toLowerCase() === 'open').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15] flex items-center gap-2.5">
            <span>Customer Queries & Helpdesk</span>
            {openCount > 0 && (
              <span className="text-xs font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                {openCount} Open
              </span>
            )}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Ticketing system for Contact Us inquiries, customer issues, email sync, and live chat thread responses
          </p>
        </div>

        <button
          onClick={loadQueries}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold px-4 py-2 rounded-full transition-colors self-start shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queries</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ticket #, name, email, subject..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs overflow-x-auto">
            {(['all', 'open', 'in-progress', 'resolved', 'closed'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {st === 'all' ? 'All Queries' : st.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Entries selector */}
        <div className="text-xs font-semibold text-stone-500 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#3b711e]"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>per page</span>
            </div>
            <span>•</span>
            <span>
              Queries Found: <strong className="text-stone-900">{filteredQueries.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-stone-200 border-t-[#3b711e] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-bold uppercase">Loading queries...</p>
          </div>
        ) : filteredQueries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-100">
                <tr>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Replies</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedQueries.map(q => (
                  <tr
                    key={q.id}
                    onClick={() => setSelectedQuery(q)}
                    className="hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {q.ticket_number || q.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{q.name}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{q.email}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <div className="font-bold text-stone-800">{q.subject}</div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {q.message || (q.messages && q.messages[0]?.message) || ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(q.status)}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-600">
                      {(() => {
                        const replyCount = q.replies
                          ? q.replies.length
                          : (q.messages && q.messages.length > 1 ? q.messages.length - 1 : 0);
                        return replyCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-stone-100 px-2 py-0.5 rounded-full font-bold text-stone-800">
                            <MessageSquare className="w-3 h-3 text-[#3b711e]" />
                            <span>{replyCount} replies</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">No replies yet</span>
                        );
                      })()}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                      {new Date(q.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedQuery(q)}
                        className="bg-[#0d1f15] hover:bg-[#173323] text-white px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Open Chat →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-stone-500 space-y-1">
            <p className="font-bold text-stone-700">No support queries found matching your filters.</p>
            <p className="text-[11px]">When customers submit contact requests, they will show up here.</p>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && filteredQueries.length > 0 && (
          <div className="p-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div>
              Showing <span className="font-bold text-stone-800">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-bold text-stone-800">
                {Math.min(currentPage * pageSize, filteredQueries.length)}
              </span>{' '}
              of <span className="font-bold text-stone-800">{filteredQueries.length}</span> queries
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
                  let pageNum = idx + 1;
                  if (totalPages > 7) {
                    if (currentPage <= 4) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + idx;
                    } else {
                      pageNum = currentPage - 3 + idx;
                    }
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#0d1f15] text-white shadow-2xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          CHAT THREAD / TICKET RESOLUTION MODAL
          ========================================================= */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-6 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-100 shrink-0">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-bold text-sm bg-stone-100 text-stone-900 px-2.5 py-0.5 rounded-lg">
                    {selectedQuery.ticket_number || selectedQuery.id}
                  </span>
                  <h2 className="text-lg sm:text-xl font-serif font-black text-[#0d1f15]">
                    {selectedQuery.subject}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-stone-700">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    {selectedQuery.name}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    {selectedQuery.email}
                  </span>
                  {selectedQuery.phone && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-stone-600 font-mono">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        {selectedQuery.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Status:</span>
                  <select
                    value={(selectedQuery.status || 'open').toLowerCase().replace(/\s+/g, '-')}
                    disabled={updatingStatus}
                    onChange={e => handleStatusChange(selectedQuery.id, e.target.value as any)}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#3b711e]"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Container */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* Original User Query Box */}
              <div className="bg-[#fcfaf5] border border-amber-200/70 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#0d1f15]">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Original Customer Inquiry</span>
                  </div>
                  <span className="text-stone-400 text-[11px]">
                    {new Date(selectedQuery.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedQuery.message || (selectedQuery.messages && selectedQuery.messages[0]?.message) || ''}
                </p>
              </div>

              {/* Chat Thread Replies */}
              {(() => {
                const threadList = selectedQuery.replies && selectedQuery.replies.length > 0
                  ? selectedQuery.replies
                  : (selectedQuery.messages && selectedQuery.messages.length > 1 ? selectedQuery.messages.slice(1) : []);

                return threadList.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 text-center relative">
                      <span className="bg-white px-3 relative z-10">Conversation History</span>
                      <div className="absolute inset-0 top-1/2 border-t border-stone-200 -z-0" />
                    </div>

                    {threadList.map((reply: any) => {
                      const isAdmin = reply.sender === 'Admin' || reply.sender === 'admin' || reply.sender_name?.toLowerCase().includes('admin');
                      return (
                        <div
                          key={reply.id}
                          className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-2xs space-y-1.5 ${
                              isAdmin
                                ? 'bg-[#0d1f15] text-white rounded-br-xs'
                                : 'bg-stone-100 text-stone-800 border border-stone-200 rounded-bl-xs'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 text-[10px] opacity-75">
                              <span className="font-bold">
                                {isAdmin ? '🛡️ Admin Support' : `👤 ${reply.sender_name || 'Customer'}`}
                              </span>
                              <span>{new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">{reply.message}</p>
                          </div>
                          <span className="text-[10px] text-stone-400 mt-1 px-1">
                            {new Date(reply.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : null;
              })()}
            </div>

            {/* Admin Reply Input Box */}
            <div className="pt-4 border-t border-stone-100 shrink-0 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#3b711e]" />
                  <span>Reply will be emailed directly to <strong>{selectedQuery.email}</strong></span>
                </span>
                <span className="text-[11px] text-stone-400">Press send to dispatch email copy</span>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to the customer here..."
                  className="w-full p-3.5 text-xs rounded-2xl border border-stone-300 focus:outline-none focus:border-[#3b711e] resize-none"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSendReply();
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[11px] text-stone-400">Ctrl + Enter to send</p>
                <button
                  type="button"
                  disabled={sendingReply || !replyText.trim()}
                  onClick={handleSendReply}
                  className="inline-flex items-center gap-2 bg-[#3b711e] hover:bg-[#2d5c16] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingReply ? 'Sending Email & Replying...' : 'Send Reply via Email'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
