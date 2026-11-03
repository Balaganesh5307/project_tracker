import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Tracker | Modern Workspace',
  description: 'Full-stack Next.js project management & Kanban tracking application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-slate-100">{children}</body>
    </html>
  );
}

