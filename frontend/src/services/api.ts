
import { Project } from "../types/project";
import { mockProjects } from "./mockData";

// API Settings
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";
// Use mock mode only when explicitly enabled
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export interface ApiService {
  uploadImage(file: File): Promise<string>;
  generateProject(prompt: string, images: string[]): Promise<Project>;
  getProject(id: string): Promise<Project>;
  getProjects(): Promise<Project[]>;
}

class FrameForgeApi implements ApiService {
  async uploadImage(file: File): Promise<string> {
    if (USE_MOCK) {
      return `mock-upload-${crypto.randomUUID()}`;
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      // Propagate error to caller – no mock fallback
      throw new Error(await this.getErrorMessage(response, "Failed to upload image"));
    }
    const data = await response.json();
    return data.image_id;
  }

  async generateProject(
    prompt: string,
    images: string[]
  ): Promise<Project> {
    if (USE_MOCK) {
      const mockProjectId = `mock-${crypto.randomUUID()}`;
      return {
        id: mockProjectId,
        name: prompt || "Generated Project (Mock)",
        status: "published",
        updatedAt: new Date().toISOString(),
        previewUrl: `/preview/${mockProjectId}`,
      };
    }
    if (images.length === 0) {
      throw new Error("Upload an image before generating a project.");
    }
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_id: images[0],
        prompt,
      }),
    });
    if (!response.ok) {
      // Propagate backend error – no mock data returned
      throw new Error(await this.getErrorMessage(response, "Failed to generate project"));
    }
    const data = await response.json();
    return {
      id: data.project_id,
      name: prompt || "Generated Project",
      status: "published",
      updatedAt: new Date().toISOString(),
      previewUrl: `/preview/${data.project_id}`,
    };
  }

  async getProject(id: string): Promise<Project> {
    if (USE_MOCK) {
      const mockProject = mockProjects.find(project => project.id === id);
      return {
        id,
        name: mockProject?.name || "Generated Project (Mock)",
        status: "published",
        updatedAt: mockProject?.updatedAt || new Date().toISOString(),
        previewUrl: `/preview/${id}`,
      };
    }
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!response.ok) {
      throw new Error(await this.getErrorMessage(response, "Project not found"));
    }
    const data = await response.json();
    return {
      id: data.project_id,
      name: data.metadata?.prompt || "Generated Project",
      status: "published",
      updatedAt:
        data.metadata?.created_at || new Date().toISOString(),
      previewUrl: `/preview/${data.project_id}`,
    };
  }

  async getProjects(): Promise<Project[]> {
    if (USE_MOCK) {
      return mockProjects;
    }
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error(await this.getErrorMessage(response, "Failed to load projects"));
    }
    const data = await response.json();
    return data.map((project: any) => ({
      id: project.project_id,
      name: project.prompt || "Generated Project",
      status: "published",
      updatedAt: project.created_at,
      previewUrl: `/preview/${project.project_id}`,
    }));
  }

  private async getErrorMessage(response: Response, defaultMessage: string): Promise<string> {
    try {
      const data = await response.json();
      return data.detail || defaultMessage;
    } catch {
      return defaultMessage;
    }
  }

}

export const api = new FrameForgeApi();
