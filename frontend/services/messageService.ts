import { apiFetch } from "@/lib/api";

export interface Message {
  id: string;
  class_id: string | null;
  sender_id: string;
  content: string | null;
  message_type: string | null;
  created_at: string;
  sender?: {
    id: string;
    full_name?: string | null;
    display_name?: string | null;
    email: string;
    role: string;
  } | null;
}

export const messageService = {
  getByClass: async (classId: string): Promise<Message[]> => {
    return apiFetch(`/messages/class/${classId}`);
  },

  create: async (
    data: {
      class_id: string;
      content: string;
      message_type?: string;
    },
    senderId: string
  ): Promise<Message> => {
    return apiFetch(`/messages?sender_id=${senderId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

