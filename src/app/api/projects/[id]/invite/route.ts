import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';
import { User } from '@/lib/models/User';
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
    const { newMemberUsername } = await request.json();

    if (!newMemberUsername || !newMemberUsername.trim()) {
      return NextResponse.json(
        { error: 'Username to invite is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const targetUser = await User.findOne({ username: newMemberUsername.trim() });
    if (!targetUser) {
      return NextResponse.json({ error: 'User does not exist.' }, { status: 404 });
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    if (!project.members.includes(user.username)) {
      return NextResponse.json({ error: 'You are not a member of this project.' }, { status: 403 });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $addToSet: { members: newMemberUsername.trim() } },
      { new: true }
    );

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error('Invite member error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to invite user.' },
      { status: 500 }
    );
  }
}

