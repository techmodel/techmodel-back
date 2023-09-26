export interface CreateFeedbackDTO {
  userId: string;
  volunteerRequestId: number;
  review: number;
  notes: string;
}

export type UpdateFeedbackDTO = Partial<CreateFeedbackDTO>;
