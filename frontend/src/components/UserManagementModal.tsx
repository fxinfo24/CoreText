import React, { useState, useEffect } from 'react';
import * as api from '../api';
import * as T from '../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: T.User;
}

interface DraftUser {
  email: string;
  full_name: string;
  role: string;
  password: string;
  is_active: boolean;
}

const emptyDraft: DraftUser = { email: '', full_name: '', role: 'viewer', password: '', is_active: true };

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose, currentUser }) => {
  const isOwner = currentUser.role === 'owner';
  const [users, setUsers] = useState<T.User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // editing state: 'new' | userId | null
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftUser>(emptyDraft);

  const load = async () => {
    if (!isOwner) return;
    setLoading(true);
    try {
      setUsers(await api.listUsers());
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setError(null);
      load();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startNew = () => {
    setEditing('new');
    setDraft(emptyDraft);
    setError(null);
  };

  const startEdit = (u: T.User) => {
    setEditing(u.id);
    setDraft({ email: u.email, full_name: u.full_name, role: u.role, password: '', is_active: u.is_active });
    setError(null);
  };

  const save = async () => {
    setError(null);
    try {
      if (editing === 'new') {
        await api.createUser({
          email: draft.email,
          password: draft.password || 'abcdefgh', // backend enforces >=8; surface error if empty
          full_name: draft.full_name,
          role: draft.role,
        });
        setToast('User created');
      } else if (editing) {
        const payload: any = {
          email: draft.email,
          full_name: draft.full_name,
          role: draft.role,
          is_active: draft.is_active,
        };
        if (draft.password) payload.password = draft.password;
        await api.updateUser(editing, payload);
        setToast(editing === currentUser.id ? 'Your profile updated' : 'User updated');
      }
      setEditing(null);
      await load();
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
  };

  const remove = async (u: T.User) => {
    if (!window.confirm(`Remove user ${u.email}? This cannot be undone.`)) return;
    try {
      await api.deleteUser(u.id);
      setToast('User removed');
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to delete user');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-0.5">CoreText Access Control</span>
            <h3 className="text-lg font-bold text-white tracking-tight">{isOwner ? 'Shareholder User Directory' : 'My Profile'}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-4">
          {toast && <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">{toast}</div>}
          {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</div>}

          {/* Editor */}
          {editing ? (
            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email</label>
                  <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} type="email"
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                  <input value={draft.full_name} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })}
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Role</label>
                  <select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                    disabled={editing === currentUser.id && currentUser.role === 'admin'}
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50">
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password {editing !== 'new' && <span className="text-slate-500">(leave blank to keep)</span>}</label>
                  <input value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} type="password" autoComplete="new-password"
                    placeholder="min 8 characters"
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              {isOwner && editing !== currentUser.id && (
                <label className="flex items-center space-x-2 text-sm text-slate-300">
                  <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} />
                  <span>Account active</span>
                </label>
              )}
              <div className="flex space-x-2">
                <button onClick={save} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold text-white">Save</button>
                <button onClick={() => setEditing(null)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-slate-200">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {isOwner && (
                <button onClick={startNew} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-semibold text-white text-sm">
                  + Add User
                </button>
              )}

              {loading ? (
                <p className="text-slate-500 text-sm">Loading users…</p>
              ) : (
                <div className="space-y-2">
                  {users.map((u) => (
                    <div key={u.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                      <div>
                        <div className="text-sm font-bold text-slate-100">{u.full_name || u.email}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${u.role === 'admin' ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' : 'text-slate-400 border-slate-700 bg-slate-800/50'}`}>{u.role}</span>
                        <span className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <button onClick={() => startEdit(u)} className="text-xs text-indigo-300 hover:text-indigo-200 font-semibold">Edit</button>
                        {isOwner && u.id !== currentUser.id && (
                          <button onClick={() => remove(u)} className="text-xs text-red-400 hover:text-red-300 font-semibold">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && <p className="text-slate-500 text-sm">No users found.</p>}
                </div>
              )}
            </>
          )}

          {!isOwner && (
            <button onClick={() => startEdit(currentUser)} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold text-white text-sm">
              Edit My Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
