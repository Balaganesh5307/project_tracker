import mongoose, { Schema, Model } from 'mongoose';
import { IProject } from '../types';

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    members: [{ type: String }],
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

