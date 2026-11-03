'use client';

import React, { useState } from 'react';
import { ITask, IProject } from '@/lib/types';
import TaskCard from './TaskCard';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  CircleDashed,
  ListTodo,
} from 'lucide-react';

interface KanbanBoardProps {
  project: IProject;
  tasks: ITask[];
  onOpenNewTask: (defaultStatus?: ITask['status']) => void;
  onEditTask: (task: ITask) => void;
  onDeleteTask: (id: string) => void;
  onMoveStatus: (id: string, newStatus: ITask['status']) => void;
}

const COLUMNS: {
  id: ITask['status'];
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
}[] = [
  {
    id: 'Todo',
    title: 'To Do',
    icon: CircleDashed,
    accentColor: 'border-t-blue-500',
    badgeBg: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    icon: Clock,
    accentColor: 'border-t-amber-500',
    badgeBg: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'Done',
    title: 'Done',
    icon: CheckCircle2,
    accentColor: 'border-t-emerald-500',
    badgeBg: 'bg-emerald-500/20 text-emerald-400',
  },
];

export default function KanbanBoard({
  project,
  tasks,
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
}: KanbanBoardProps) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee?.toLowerCase().includes(search.toLowerCase());

    const matchesPriority =
      priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Calculate completion percentage
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'Done').length;
  const percentComplete =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Project Header Banner & Controls */}
      <div className="glass-panel rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {project.name}
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {project.members?.length || 1} {project.members?.length === 1 ? 'member' : 'members'}
              </span>
            </div>
            {project.description && (
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                {project.description}
              </p>
            )}
          </div>

          <button
            onClick={() => onOpenNewTask('Todo')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Overall Progress</span>
            <span className="text-slate-200">
              {doneTasks} of {totalTasks} tasks completed ({percentComplete}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks or assignees..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="glass-input text-xs py-2 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className={`glass-panel rounded-2xl p-4 border border-slate-800 border-t-4 ${col.accentColor} flex flex-col h-[calc(100vh-320px)] min-h-[480px] shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-200">
                    {col.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.badgeBg}`}
                  >
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onOpenNewTask(col.id)}
                  className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
                  title={`Add to ${col.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.length > 0 ? (
                  colTasks.map((t) => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onMoveStatus={onMoveStatus}
                    />
                  ))
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                    <ListTodo className="w-6 h-6 mb-2 opacity-40" />
                    <span>No tasks in {col.title}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

