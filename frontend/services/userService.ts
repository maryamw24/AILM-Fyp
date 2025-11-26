
import { apiFetch } from "@/lib/api";
import { User } from '@/models/user';


export const userService = {

    login: async (data: { email: string; password: string}): Promise<User> => {
    return apiFetch(`/teacher/login`, {
      method: "POST",
      body: JSON. stringify(data),
    }); 
  },
}