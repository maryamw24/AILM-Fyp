import { apiFetch } from "@/lib/api";

export interface Resource {
  id: string;
  class_id: string;
  title: string | null;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  uploaded_at: string;
  uploader_id: string;
}

export const resourceService = {
  getByClass: async (classId: string): Promise<Resource[]> => {
    return apiFetch(`/resources/class/${classId}`);
  },

  create: async (
    data: {
      class_id: string;
      title: string;
      description?: string;
      file_url: string;
      file_type?: string;
    },
    uploaderId: string
  ): Promise<Resource> => {
    return apiFetch(`/resources?uploader_id=${uploaderId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete: async (resourceId: string): Promise<void> => {
    return apiFetch(`/resources/${resourceId}`, {
      method: "DELETE",
    });
  },
};

