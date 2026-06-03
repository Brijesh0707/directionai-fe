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

export type RazorpayPlanOrder = {
  id: string;
  userId: string;
  planCode: 'PROJECT_20' | 'PROJECT_30';
  planName: string;
  amountInr: number;
  amountPaise: number;
  projects: number;
  receipt: string;
  orderId: string;
  paymentId: string | null;
  signature: string | null;
  status: 'created' | 'paid' | 'failed';
  paidAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RazorpayOrderResponse = {
  message: string;
  plan: PaidProjectPlan;
  order: RazorpayPlanOrder;
  razorpayKeyId: string;
};

export type RazorpayVerifyResponse = {
  message: string;
  plan: PaidProjectPlan;
  order: RazorpayPlanOrder;
  user: User;
};

export type ForgotPasswordRequestResponse = {
  message: string;
  expiresInMinutes: number;
};

export type ResetPasswordResponse = {
  message: string;
};
