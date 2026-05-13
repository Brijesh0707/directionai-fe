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
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
};
