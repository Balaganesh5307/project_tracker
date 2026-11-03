import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/lib/models/Task';
import { Project } from '@/lib/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, dueDate, status, projectId, assignee } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Task title is required.' }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    if (!project.members.includes(user.username)) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const newTask = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      dueDate: dueDate || undefined,
      status: status || 'Todo',
      projectId,
      assignee: assignee || 'Unassigned',
    });

    await newTask.save();
    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create task.' },
      { status: 500 }
    );
  }
}

