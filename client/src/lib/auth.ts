import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export async function loginWithMicrosoft(): Promise<AuthUser> {
  // Mock Microsoft authentication - in production, this would use MSAL
  const mockUser = {
    id: 'mock-user-id',
    name: 'João Silva',
    email: 'joao@empresa.com'
  };

  const mockToken = 'mock-microsoft-token';

  const response = await apiRequest('POST', '/api/auth/login', {
    token: mockToken,
    user: mockUser
  });

  const data: AuthResponse = await response.json();
  return data.user;
}

export async function logout(): Promise<void> {
  await apiRequest('POST', '/api/auth/logout');
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await apiRequest('GET', '/api/auth/me');
    const data: AuthResponse = await response.json();
    return data.user;
  } catch (error) {
    return null;
  }
}
