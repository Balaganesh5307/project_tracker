import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const projects = await Project.find({ members: user.username }).sort({ updatedAt: -1 });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Fetch projects error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { name, description } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Project name is required.' },
        { status: 400 }
      );
    }

    const newProject = new Project({
      name: name.trim(),
      description: description ? description.trim() : '',
      members: [user.username],
    });

    await newProject.save();
    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project.' },
      { status: 500 }
    );
  }
}

