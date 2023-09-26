export interface CreateFeedbackDTO {
  userId: string;
  volunteerRequestId: string;
  review: number;
  notes: string;
}

export type UpdateFeedbackDTO = Partial<CreateFeedbackDTO>;
