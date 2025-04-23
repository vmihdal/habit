import { IsString, IsEnum, IsOptional, IsInt, IsDate, IsHexColor } from 'class-validator';
import { HabitFrequency, HabitStatus } from '@prisma/client';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsEnum(HabitFrequency)
  frequency: HabitFrequency;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsDate()
  @IsOptional()
  reminder?: Date;

  @IsEnum(HabitStatus)
  @IsOptional()
  status?: HabitStatus;

  @IsInt()
  @IsOptional()
  targetDays?: number;

  @IsString()
  @IsHexColor()
  @IsOptional()
  color?: string;
} 