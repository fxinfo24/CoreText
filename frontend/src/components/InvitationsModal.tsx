import React, { useState, useEffect } from 'react';
import * as api from '../api';

interface InvitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function stateOf(inv: api.InviteCode): { label: string; cls: string } {
  if (inv.revoked) return { label: 'Revoked', cls: 'text-red-400' };
  if (inv.used_by) return { label: 'Used', cls: 'text-emerald-400' };
  return { label: 'Unused', cls: 'text-amber-400' };
}

export const InvitationsModal: React.FC<InvitationsModalProps> = ({ isOpen, onClose }) => {
  const [invites, setInvites] = useState<api.InviteCode[]>([]);
  const [count, setCount] = useState(1);
  const [role, setRole] = useState<'viewer' | 'admin'>('viewer');
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setInvites(await api.listInvites());
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to load invites');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNewCodes([]);
      load();
    }
  }, [isOpen]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const created = await api.createInvites({ count, role });
      setNewCodes(created.map((c) => c.code || ''));
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to generate invites');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await api.revokeInvite(id);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to revoke');
    }
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">Invitation Codes</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
          )}

          <form onSubmit={handleGenerate} className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">Count</label>
              <input
                type="number" min={1} max={50} value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
                className="w-20 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">Role granted</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'viewer' | 'admin')}
                className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="viewer">viewer</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <button
              type="submit" disabled={loading}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 px-4 py-2.5 font-semibold text-white"
            >
              {loading ? 'Generating…' : 'Generate'}
            </button>
          </form>

          {newCodes.length > 0 && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-xs text-emerald-300 mb-2">New codes (copy now — they are shown only once):</p>
              <ul className="space-y-1.5">
                {newCodes.map((c, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <code className="text-emerald-200 text-sm break-all">{c}</code>
                    <button onClick={() => copy(c)} className="text-xs text-emerald-400 hover:text-emerald-200 shrink-0">Copy</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">All codes</h3>
            {invites.length === 0 ? (
              <p className="text-sm text-slate-500">No invite codes yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-left border-b border-slate-800">
                    <th className="py-2 pr-2 font-medium">Status</th>
                    <th className="py-2 pr-2 font-medium">Role</th>
                    <th className="py-2 pr-2 font-medium">Created</th>
                    <th className="py-2 pr-2 font-medium">Used by</th>
                    <th className="py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((inv) => {
                    const s = stateOf(inv);
                    return (
                      <tr key={inv.id} className="border-b border-slate-900 text-slate-300">
                        <td className={`py-2 pr-2 font-medium ${s.cls}`}>{s.label}</td>
                        <td className="py-2 pr-2">{inv.role}</td>
                        <td className="py-2 pr-2 text-slate-500">{inv.created_at?.slice(0, 10)}</td>
                        <td className="py-2 pr-2 text-slate-500 truncate max-w-[120px]">{inv.used_by ? inv.used_by.slice(0, 8) + '…' : '—'}</td>
                        <td className="py-2 text-right">
                          {!inv.revoked && !inv.used_by && (
                            <button onClick={() => handleRevoke(inv.id)} className="text-xs text-red-400 hover:text-red-300">Revoke</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
