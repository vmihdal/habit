export interface HabitDto {
  id: number;
  name: string;
  frequency: string;
  customDates?: string[];
  doneDates?: string[];
  goals?: GoalDto[];
}

export interface CreateGoalDto {
  name: string;
  completed: boolean;
}

export interface GoalDto {
  id: number;
  name: string;
  completed: boolean;
}

export enum HabitFrequency {
  DAILY = 'DAILY',
  CUSTOM = 'CUSTOM'
}

export enum HabitStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  COMPLETED = 'COMPLETED'
}

export interface HabitDto {
  id: number;
  name: string;
  frequency: HabitFrequency;
  startDate?: Date;
  endDate?: Date;
  reminder?: Date;
  status?: HabitStatus;
  targetDays?: number;
  color?: string;  // Hex color format (#RRGGBB or #RGB)
  customDates?: Date[];
  doneDates?: Date[];
  goals?: GoalDto[];
} 