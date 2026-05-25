export type User = {
  id: string;
  email: string;
  name: string | null;
  provider: 'email' | 'google';
  googleId: string | null;
  avatarUrl: string | null;
  role: string;
  onboardingDone: boolean;
  onboardingUserType: string | null;
  onboardingSource: string | null;
  onboardingGoal: string | null;
  onboardingStage: string | null;
  planTier: 'free' | 'project_bundle';
  projectCredits: number;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
};

export type PaidProjectPlan = {
  code: 'PROJECT_20' | 'PROJECT_30';
  name: string;
  projects: number;
  priceInr: number;
  pricePerProjectInr: number;
};

export type PlansResponse = {
  free: {
    name: string;
    includedProjects: number;
    note: string;
  };
  paid: PaidProjectPlan[];
  pricingBasis: {
    operationalCostPerProjectInr: number;
    marginPerProjectInr: number;
    billedPerProjectInr: number;
  };
};
