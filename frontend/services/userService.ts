
import { apiFetch } from "@/lib/api";
import { User } from '@/models/user';


// Helper to transform backend user response to frontend User model
function transformUser(userData: any): User {
  return {
    ...userData,
    name: userData.display_name || userData.full_name || userData.email,
    role: userData.role as User['role']
  }
}

export const userService = {

    login: async (data: { email: string; password: string}): Promise<User> => {
    const userData = await apiFetch<any>(`/teacher/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return transformUser(userData);
  },

  signup: async (data: { 
    email: string; 
    password: string; 
    full_name?: string; 
    display_name?: string; 
    role?: string;
  }): Promise<User> => {
    const userData = await apiFetch<any>(`/teacher/signup`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return transformUser(userData);
  },
}