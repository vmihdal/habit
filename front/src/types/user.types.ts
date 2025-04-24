import { HabitDto } from './habit.types';

export interface UserDto {
  id: number;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  habits: HabitDto[];
} 