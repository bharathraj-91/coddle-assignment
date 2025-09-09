export interface Baby {
  id: string;
  name: string;
  dateOfBirth: Date; // ISO date string (UTC 00:00)
  gender: 'male' | 'female' | 'other';
}