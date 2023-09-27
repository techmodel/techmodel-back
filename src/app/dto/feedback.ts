export interface CreateFeedbackDTO {
  userId: string;
  volunteerRequestId: number;
  rating: number;
  notes: string;
}

export type UpdateFeedbackDTO = Partial<CreateFeedbackDTO>;
