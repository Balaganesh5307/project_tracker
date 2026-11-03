import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/lib/models/Task';
import { Project } from '@/lib/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    // Verify user belongs to the project
    const project = await Project.findById(task.projectId);
    if (!project || !project.members.includes(user.username)) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update task.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    const project = await Project.findById(task.projectId);
    if (!project || !project.members.includes(user.username)) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete task.' },
      { status: 500 }
    );
  }
}

