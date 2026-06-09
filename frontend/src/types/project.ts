export type GenerationStatus = 'idle' | 'uploading' | 'analyzing' | 'extracting' | 'generating' | 'completed' | 'error';

export interface Project {
  id: string;
  name: string;
  status: 'draft' | 'published';
  updatedAt: string;
  previewUrl?: string;
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface WorkspaceState {
  currentProject: Project | null;
  projects: Project [];
  messages: Message[];
  status: GenerationStatus;
  uploadedImages: File[];
  previewUrl: string | null;
}
