'use client';

import React from 'react';
import { IProject } from '@/lib/types';
import {
  FolderKanban,
  Plus,
  LogOut,
  User,
  FolderPlus,
  UserPlus,
  Trash2,
} from 'lucide-react';

interface NavbarProps {
  username: string;
  projects: IProject[];
  activeProject: IProject | null;
  onSelectProject: (project: IProject) => void;
  onOpenNewProject: () => void;
  onOpenInvite: () => void;
  onDeleteProject: () => void;
  onLogout: () => void;
}

export default function Navbar({
  username,
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProject,
  onOpenInvite,
  onDeleteProject,
  onLogout,
}: NavbarProps) {
  return (
    <header className="glass-panel border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
              Project Tracker
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Next.js
              </span>
            </h1>
            <p className="text-xs text-slate-400">Team Kanban Workspace</p>
          </div>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {projects.length > 0 && (
            <div className="relative">
              <select
                value={activeProject?._id || ''}
                onChange={(e) => {
                  const found = projects.find((p) => p._id === e.target.value);
                  if (found) onSelectProject(found);
                }}
                className="glass-input text-xs sm:text-sm py-2 px-3 rounded-xl bg-slate-900/80 border border-slate-700/80 cursor-pointer appearance-none pr-8 text-slate-200"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id} className="bg-slate-900 text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-blue-600/20 transition-all"
            title="Create Project"
          >
            <FolderPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Project</span>
          </button>

          {activeProject && (
            <>
              <button
                onClick={onOpenInvite}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card hover:bg-slate-700/50 text-slate-200 text-xs sm:text-sm border border-slate-700/60 transition-all"
                title="Invite Team Member"
              >
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span className="hidden md:inline">Invite</span>
              </button>

              <button
                onClick={onDeleteProject}
                className="p-2 rounded-xl glass-card hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-all"
                title="Delete Current Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* User info & Logout */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs sm:text-sm text-slate-300">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium max-w-[100px] truncate">{username}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

