export interface UserInfo {
    id: number;
    username: string;
    name: string;
    email: string;
    bio?: string;
    createdAt: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
    rememberMe : boolean;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: UserInfo;
    // accessToken은 응답 헤더에서 받아옴
  }

  export interface UserUpdateRequest {
    currentPassword: string;
    newPassword?: string;
    newPasswordConfirm?: string;
    name?: string;
  }