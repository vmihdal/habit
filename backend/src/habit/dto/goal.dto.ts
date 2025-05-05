import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({
    description: 'The name of the goal',
    example: 'Run 5km',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Whether the goal is completed',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export class GoalDto extends CreateGoalDto {
  @ApiProperty({
    description: 'The ID of the goal',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The ID of the associated habit',
    example: 1,
  })
  habitId: number;
} 