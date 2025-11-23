// src/services/classService.ts
import { apiFetch } from "@/lib/api";
import { Class } from "@/models/class";


export const classService = {
  getAll: async (): Promise<Class[]> => {
    return apiFetch("/classes/owner/bfb5f450-e5b4-42b3-a1de-c5cd92618a90");
  },

  create: async (data: { title: string; description?: string; code: string; is_public: boolean }, owner_id: string): Promise<Class> => {
    return apiFetch(`/classes?owner_id=${owner_id}`, {
      method: "POST",
      body: JSON. stringify(data),
    }); 
  },

  getClass: async (id: string ): Promise<Class> => {
    return apiFetch(`/classes/${id}`);
  },
};


