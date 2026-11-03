'use client';

import React, { useState } from 'react';
import { X, UserPlus, Users } from 'lucide-react';
import { IProject } from '@/lib/types';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: IProject | null;
  onInvite: (username: string) => Promise<void>;
}

export default function InviteModal({
  isOpen,
  onClose,
  project,
  onInvite,
}: InviteModalProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username to invite');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await onInvite(username.trim());
      setSuccess(`@${username.trim()} was added to ${project.name}`);
      setUsername('');
    } catch (err: any) {
      setError(err.message || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 shadow-2xl border border-slate-700/80 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Invite Collaborator</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
            {success}
          </div>
        )}

        {/* Existing members */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Current Members ({project.members?.length || 1})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.members?.map((m) => (
              <span
                key={m}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
              >
                @{m}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Username to Invite
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. sarah_design"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
            >
              Done
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Inviting...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

