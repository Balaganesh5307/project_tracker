export interface IUser {
  _id: string;
  username: string;
  password?: string;
  createdAt?: string;
}

export interface IProject {
  _id: string;
  name: string;
  description: string;
  members: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Done';
  dueDate?: string;
  projectId: string;
  assignee: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUserPayload {
  id: string;
  username: string;
}

