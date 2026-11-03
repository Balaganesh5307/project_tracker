import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';
import { Task } from '@/lib/models/Task';
import { getUserFromRequest } from '@/lib/auth';

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

    // Verify user is a member of this project
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    if (!project.members.includes(user.username)) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    await Project.findByIdAndDelete(id);
    await Task.deleteMany({ projectId: id });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project.' },
      { status: 500 }
    );
  }
}

