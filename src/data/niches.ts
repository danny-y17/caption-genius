export interface Niche {
  id: string;
  name: string;
  icon: string;
}

export const niches: Niche[] = [
  { id: 'yoga', name: 'Yoga Studio', icon: '🧘‍♀️' },
  { id: 'coffee', name: 'Indie Coffee Shop', icon: '☕' },
  { id: 'fitness', name: 'Fitness Trainer', icon: '💪' },
  { id: 'photography', name: 'Photography', icon: '📸' },
  { id: 'salon', name: 'Hair Salon', icon: '💇‍♀️' },
  { id: 'food', name: 'Food Blogger', icon: '🍽️' },
]; 