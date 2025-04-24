export interface HabitDto {
  id: number;
  name: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  startDate: Date;
  endDate?: Date;
  reminder?: Date;
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
  targetDays?: number;
  color?: string;
} 