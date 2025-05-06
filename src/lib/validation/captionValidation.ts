export interface CaptionInput {
  niche: string;
  input: string;
  userId: string;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateCaptionInput({ niche, input, userId }: CaptionInput) {
  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  if (!niche) {
    throw new ValidationError('Niche is required');
  }

  if (!input || input.length < 10) {
    throw new ValidationError('Post description must be at least 10 characters');
  }

  if (input.length > 500) {
    throw new ValidationError('Post description cannot exceed 500 characters');
  }

  return true;
}

export interface SaveCaptionInput {
  user_id: string;
  niche_id: string;
  prompt: string;
  generated_caption: string;
  is_favorite?: boolean;
  usage_count?: number;
}

export function validateSaveCaption(caption: SaveCaptionInput) {
  if (!caption.user_id) {
    throw new ValidationError('User ID is required');
  }

  if (!caption.niche_id) {
    throw new ValidationError('Niche ID is required');
  }

  if (!caption.prompt) {
    throw new ValidationError('Prompt is required');
  }

  if (!caption.generated_caption) {
    throw new ValidationError('Generated caption is required');
  }

  return true;
}