import { PartialType } from '@nestjs/mapped-types';
import { HabitDto as CreateHabitDto } from './habit.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { HabitFrequency, HabitStatus } from '../enums/habit.enum';

export class UpdateHabitDto extends PartialType(CreateHabitDto) {
  @ApiPropertyOptional({ 
    description: 'The name of the habit',
    example: 'Daily Exercise'
  })
  name?: string;

  @ApiPropertyOptional({ 
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'],
    description: 'How often the habit should be performed',
    example: 'DAILY'
  })
  frequency?: HabitFrequency;

  @ApiPropertyOptional({ 
    description: 'The end date of the habit',
    example: '2024-12-31T23:59:59Z',
    type: 'string',
    format: 'date-time'
  })
  endDate?: Date;

  @ApiPropertyOptional({ 
    description: 'The reminder time for the habit',
    example: '2024-03-26T08:00:00Z',
    type: 'string',
    format: 'date-time'
  })
  reminder?: Date;

  @ApiPropertyOptional({ 
    enum: ['ACTIVE', 'ARCHIVED', 'COMPLETED'],
    description: 'The current status of the habit',
    example: 'ACTIVE'
  })
  status?: HabitStatus;

  @ApiPropertyOptional({ 
    description: 'The target number of days to complete the habit',
    example: 30,
    type: 'integer',
    minimum: 1
  })
  targetDays?: number;

  @ApiPropertyOptional({ 
    description: 'The color of the habit in hex format',
    example: '#FF5733',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
  })
  color?: string;
} 