'use client';

import React from 'react';
import { ITask } from '@/lib/types';
import {
  Calendar,
  User,
  Edit2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface TaskCardProps {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
  onMoveStatus: (id: string, newStatus: ITask['status']) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onMoveStatus,
}: TaskCardProps) {
  const priorityColor = {
    Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    High: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  }[task.priority || 'Medium'];

  const getNextStatus = (current: ITask['status']): ITask['status'] | null => {
    if (current === 'Todo') return 'In Progress';
    if (current === 'In Progress') return 'Done';
    return null;
  };

  const getPrevStatus = (current: ITask['status']): ITask['status'] | null => {
    if (current === 'Done') return 'In Progress';
    if (current === 'In Progress') return 'Todo';
    return null;
  };

  const prev = getPrevStatus(task.status);
  const next = getNextStatus(task.status);

  return (
    <div className="glass-card rounded-xl p-4 border border-slate-700/60 hover:border-slate-600 transition-all shadow-sm hover:shadow-md group">
      {/* Header / Priority */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityColor}`}
        >
          {task.priority || 'Medium'}
        </span>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-all"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <h4 className="text-sm font-semibold text-slate-100 leading-snug mb-1">
        {task.title}
      </h4>
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Meta info: Due date & Assignee */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80 mb-3">
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-slate-300">
          <User className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate max-w-[120px]">{task.assignee || 'Unassigned'}</span>
        </div>
      </div>

      {/* Move Status Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {prev ? (
          <button
            onClick={() => onMoveStatus(task._id, prev)}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-blue-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>{prev}</span>
          </button>
        ) : (
          <div />
        )}

        {next && (
          <button
            onClick={() => onMoveStatus(task._id, next)}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-blue-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800 ml-auto"
          >
            <span>{next}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

