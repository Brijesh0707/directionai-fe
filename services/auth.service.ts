import api from './api';
import {
  AuthResponse,
  ForgotPasswordRequestResponse,
  PlansResponse,
  RazorpayOrderResponse,
  RazorpayVerifyResponse,
  ResetPasswordResponse,
  User,
} from '@/types/auth';

export type RegisterInput = { email: string; password: string; name?: string };
export type LoginInput = { email: string; password: string };
export type OnboardingInput = {
  userType?: string;
  source?: string;
  goal?: string;
  stage?: string;
};

export const authService = {
  register: async (payload: RegisterInput) => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },
  login: async (payload: LoginInput) => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  googleLogin: async (idToken: string) => {
    const { data } = await api.post<AuthResponse>('/auth/google', { idToken });
    return data;
  },
  refresh: async (refreshToken: string) => {
    const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  },
  me: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
  saveOnboarding: async (payload: OnboardingInput) => {
    const { data } = await api.patch<{ user: User; message: string }>('/auth/onboarding', payload);
    return data;
  },
  logout: async (refreshToken: string) => {
    const { data } = await api.post<{ success: boolean; message: string }>('/auth/logout', {
      refreshToken,
    });
    return data;
  },
  requestPasswordReset: async (email: string) => {
    const { data } = await api.post<ForgotPasswordRequestResponse>('/auth/forgot-password/request', {
      email,
    });
    return data;
  },
  resetPasswordWithOtp: async (payload: { email: string; otp: string; newPassword: string }) => {
    const { data } = await api.post<ResetPasswordResponse>('/auth/forgot-password/reset', payload);
    return data;
  },
  getPlans: async () => {
    const { data } = await api.get<PlansResponse>('/auth/plans');
    return data;
  },
  createPlanOrder: async (planCode: 'PROJECT_20' | 'PROJECT_30') => {
    const { data } = await api.post<RazorpayOrderResponse>('/auth/plans/purchase', {
      planCode,
    });
    return data;
  },
  verifyPlanPayment: async (payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const { data } = await api.post<RazorpayVerifyResponse>('/auth/plans/verify', payload);
    return data;
  },
};
