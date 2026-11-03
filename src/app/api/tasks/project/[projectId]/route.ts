import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/lib/models/Task';
import { Project } from '@/lib/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await params;
    await connectToDatabase();

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    if (!project.members.includes(user.username)) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('Fetch tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tasks.' },
      { status: 500 }
    );
  }
}

