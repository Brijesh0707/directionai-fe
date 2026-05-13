export type MockProject = {
  id: string;
  title: string;
  idea: string;
  status: string;
  progress: number;
  createdAt: string;
};

export const MOCK_PROJECTS_KEY = 'directionai-mock-projects';
export const MOCK_PROJECTS_EVENT = 'directionai:projects-updated';

export const readMockProjects = (): MockProject[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(MOCK_PROJECTS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as MockProject[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

export const writeMockProjects = (projects: MockProject[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MOCK_PROJECTS_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event(MOCK_PROJECTS_EVENT));
};

export const createMockProject = (idea: string): MockProject => {
  const cleanIdea = idea.trim();
  const titleBase = cleanIdea.split(/[.!?]/)[0]?.trim() || 'Untitled Project';

  return {
    id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: titleBase.slice(0, 44),
    idea: cleanIdea,
    status: 'Draft',
    progress: 5,
    createdAt: new Date().toISOString(),
  };
};
