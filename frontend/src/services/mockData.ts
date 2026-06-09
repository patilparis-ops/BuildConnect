import { Project, Message } from "../types/project";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Fintech Dashboard UI",
    status: "published",
    updatedAt: new Date().toISOString(),
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=400&h=300&fit=crop"
  },
  {
    id: "2",
    name: "AI Video Platform",
    status: "draft",
    updatedAt: new Date().toISOString(),
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop"
  }
];

export const initialMessages: Message[] = [
  {
    id: "m1",
    role: "assistant",
    content: "Hello! I'm ready to help you build your project. Upload a wireframe, screenshot, or provide a prompt to get started.",
    timestamp: new Date().toISOString()
  }
];
