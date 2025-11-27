// src/services/classService.ts
import { apiFetch } from "@/lib/api";
import { Class } from "@/models/class";


export const classService = {
  getAll: async (ownerId: string): Promise<Class[]> => {
    return apiFetch(`/classes/owner/${ownerId}`);
  },

  create: async (data: { title: string; description?: string; code: string; is_public: boolean }, owner_id: string): Promise<Class> => {
    return apiFetch(`/classes?owner_id=${owner_id}`, {
      method: "POST",
      body: JSON.stringify(data),
    }); 
  },

  getClass: async (id: string): Promise<Class> => {
    return apiFetch(`/classes/${id}`);
  },

  joinClassByCode: async (code: string, userId: string): Promise<Class> => {
    return apiFetch(`/classes/join`, {
      method: "POST",
      body: JSON.stringify({ code, user_id: userId }),
    });
  },

  getStudentClasses: async (userId: string): Promise<Class[]> => {
    return apiFetch(`/classes/student/${userId}`);
  },
};


