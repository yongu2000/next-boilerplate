import { axiosInstance } from './axios';


interface VerifyCodeResponse {
  verified: boolean;
}

export const emailService = {
  sendVerificationCode: async (email: string) => {
    const response = await axiosInstance.post<null>('/email/send/code', { email });
    return response.data;
  },

  verifyCode: async (email: string, code: string) => {
    const response = await axiosInstance.post<VerifyCodeResponse>('/email/verify/code', {
      email,
      code
    });
    return response.data;
  }
}; 