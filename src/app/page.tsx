'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { IProject, ITask } from '@/lib/types';
import AuthView from '@/components/AuthView';
import Navbar from '@/components/Navbar';
import KanbanBoard from '@/components/KanbanBoard';
import TaskModal from '@/components/TaskModal';
import ProjectModal from '@/components/ProjectModal';
import InviteModal from '@/components/InviteModal';
import { FolderKanban, Plus, Loader2 } from 'lucide-react';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  const [projects, setProjects] = useState<IProject[]>([]);
  const [activeProject, setActiveProject] = useState<IProject | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [taskDefaultStatus, setTaskDefaultStatus] = useState<ITask['status']>('Todo');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Hydrate auth from localStorage on client mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('username');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUsername(savedUser);
    }
    setMounted(true);
  }, []);

  const authHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    if (!token) return;
    setLoadingProjects(true);
    try {
      const res = await fetch('/api/projects', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data: IProject[] = await res.json();
        setProjects(data);
        if (data.length > 0) {
          // Keep current active project or select first
          setActiveProject((prev) => {
            if (prev) {
              const stillExists = data.find((p) => p._id === prev._id);
              if (stillExists) return stillExists;
            }
            return data[0];
          });
        } else {
          setActiveProject(null);
        }
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  }, [token, authHeaders]);

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token, fetchProjects]);

  // Fetch tasks when active project changes
  const fetchTasks = useCallback(async () => {
    if (!token || !activeProject) {
      setTasks([]);
      return;
    }
    setLoadingTasks(true);
    try {
      const res = await fetch(`/api/tasks/project/${activeProject._id}`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data: ITask[] = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  }, [token, activeProject, authHeaders]);

  useEffect(() => {
    if (activeProject) {
      fetchTasks();
    }
  }, [activeProject, fetchTasks]);

  // Auth login handler
  const handleAuthSuccess = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername('');
    setProjects([]);
    setActiveProject(null);
    setTasks([]);
  };

  // Project operations
  const handleCreateProject = async (name: string, description: string) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create project');
    }

    const created: IProject = await res.json();
    setProjects((prev) => [created, ...prev]);
    setActiveProject(created);
  };

  const handleDeleteProject = async () => {
    if (!activeProject) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete workspace "${activeProject.name}" and all its tasks?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/projects/${activeProject._id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete project');
        return;
      }

      const remaining = projects.filter((p) => p._id !== activeProject._id);
      setProjects(remaining);
      setActiveProject(remaining.length > 0 ? remaining[0] : null);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleInviteUser = async (newMemberUsername: string) => {
    if (!activeProject) return;
    const res = await fetch(`/api/projects/${activeProject._id}/invite`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ newMemberUsername }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to invite user');
    }

    const updated: IProject = await res.json();
    setActiveProject(updated);
    setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  // Task operations
  const handleSaveTask = async (taskData: Partial<ITask>) => {
    if (!activeProject) return;

    if (editingTask) {
      // Update existing
      const res = await fetch(`/api/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update task');
      }

      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } else {
      // Create new
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ...taskData,
          projectId: activeProject._id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create task');
      }

      const created = await res.json();
      setTasks((prev) => [created, ...prev]);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete task');
        return;
      }

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const handleMoveStatus = async (taskId: string, newStatus: ITask['status']) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Rollback on error
        fetchTasks();
      }
    } catch (err) {
      console.error('Move status error:', err);
      fetchTasks();
    }
  };

  const handleOpenNewTask = (defaultStatus: ITask['status'] = 'Todo') => {
    setEditingTask(null);
    setTaskDefaultStatus(defaultStatus);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: ITask) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <AuthView onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        username={username}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => setActiveProject(p)}
        onOpenNewProject={() => setIsProjectModalOpen(true)}
        onOpenInvite={() => setIsInviteModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {loadingProjects ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 px-6 glass-panel rounded-3xl border border-slate-800 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Workspaces Found</h3>
            <p className="text-sm text-slate-400 mb-6">
              Create your first project workspace to begin tracking tasks and collaborating with your team.
            </p>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Workspace</span>
            </button>
          </div>
        ) : activeProject ? (
          <KanbanBoard
            project={activeProject}
            tasks={tasks}
            onOpenNewTask={handleOpenNewTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveStatus={handleMoveStatus}
          />
        ) : null}
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
        defaultStatus={taskDefaultStatus}
        members={activeProject?.members || [username]}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        project={activeProject}
        onInvite={handleInviteUser}
      />
    </div>
  );
}

