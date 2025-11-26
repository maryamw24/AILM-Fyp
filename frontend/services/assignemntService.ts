import { apiFetch } from "@/lib/api";
import { Assignment } from "@/models/assignment";


export const assignmentService = {
  getAssignemntsByClass: async (class_id: string): Promise<Assignment[]> => {
    return apiFetch(`/assignments/${class_id}`);
  },

  create: async (data: {class_id: string;  title: string; description?: string; allowedLanguages: string[]; maxScore: number; openAt: string;  dueAt: string; allowMultipleSubmissions: boolean }, created_by: string): Promise<any> => {
      return apiFetch(`/assignments?created_by=${created_by}`, {
        method: "POST",
        body: JSON. stringify(data),
      }); 
    },

    addQuestion: async(
  assignmentId: string,
  data: {  
      title: string
      prompt: string
      points: number
      position: number
      testcases: Array<{
        input: string
        expected_output: string
        is_hidden: boolean
      }>
  }): Promise<any> => {
      return apiFetch(`/assignments/${assignmentId}/questions`, {
        method: "POST",
        body: JSON. stringify(data),
      }); 
    },

    getAssignmentDetails: async(assignmentId: string):Promise<Assignment>=>{
       return apiFetch(`/assignments/${assignmentId}/preview`);
    }
};

