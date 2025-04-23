import { IsString, IsEnum, IsOptional, IsInt, IsDate, IsHexColor } from 'class-validator';
import { HabitFrequency, HabitStatus } from '../enums/habit.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHabitDto {
  @ApiProperty({ 
    description: 'The name of the habit',
    example: 'Daily Exercise',
    required: true
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'],
    description: 'How often the habit should be performed',
    example: 'DAILY',
    required: true
  })
  @IsEnum(HabitFrequency)
  frequency: HabitFrequency;

  @ApiPropertyOptional({ 
    description: 'The end date of the habit',
    example: '2024-12-31T23:59:59Z',
    type: 'string',
    format: 'date-time'
  })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ 
    description: 'The reminder time for the habit',
    example: '2024-03-26T08:00:00Z',
    type: 'string',
    format: 'date-time'
  })
  @IsDate()
  @IsOptional()
  reminder?: Date;

  @ApiPropertyOptional({ 
    enum: ['ACTIVE', 'ARCHIVED', 'COMPLETED'],
    description: 'The current status of the habit',
    example: 'ACTIVE',
    default: 'ACTIVE'
  })
  @IsEnum(HabitStatus)
  @IsOptional()
  status?: HabitStatus;

  @ApiPropertyOptional({ 
    description: 'The target number of days to complete the habit',
    example: 30,
    type: 'integer',
    minimum: 1
  })
  @IsInt()
  @IsOptional()
  targetDays?: number;

  @ApiPropertyOptional({ 
    description: 'The color of the habit in hex format',
    example: '#FF5733',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
  })
  @IsString()
  @IsHexColor()
  @IsOptional()
  color?: string;
} 