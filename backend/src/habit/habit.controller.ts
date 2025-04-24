import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { HabitService } from './habit.service';
import { HabitDto as CreateHabitDto } from './dto/habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/types/request.types';

@ApiTags('habits')
@ApiBearerAuth()
@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiBody({ type: CreateHabitDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The habit has been successfully created.',
    type: CreateHabitDto
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Req() req: RequestWithUser, @Body() createHabitDto: CreateHabitDto) {
    return this.habitService.create(req.user.id, createHabitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all habits' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all habits.',
    type: [CreateHabitDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Req() req: RequestWithUser) {
    return this.habitService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a habit by id' })
  @ApiParam({ name: 'id', description: 'The id of the habit', example: '1' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the habit.',
    type: CreateHabitDto
  })
  @ApiResponse({ status: 404, description: 'Habit not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.habitService.findOne(req.user.id, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a habit' })
  @ApiParam({ name: 'id', description: 'The id of the habit', example: '1' })
  @ApiBody({ type: UpdateHabitDto })
  @ApiResponse({ 
    status: 200, 
    description: 'The habit has been successfully updated.',
    type: CreateHabitDto
  })
  @ApiResponse({ status: 404, description: 'Habit not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(@Req() req: RequestWithUser, @Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitService.update(req.user.id, +id, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiParam({ name: 'id', description: 'The id of the habit', example: '1' })
  @ApiResponse({ 
    status: 200, 
    description: 'The habit has been successfully deleted.'
  })
  @ApiResponse({ status: 404, description: 'Habit not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.habitService.remove(req.user.id, +id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get habit statistics' })
  @ApiParam({ name: 'id', type: 'number', description: 'Habit ID' })
  @ApiResponse({ status: 200, description: 'Return the habit statistics.' })
  @ApiResponse({ status: 404, description: 'Habit not found.' })
  getStats(@Param('id') id: string) {
    // TODO: Get userId from JWT token
    const userId = 1; // Temporary
    return this.habitService.getHabitStats(userId, +id);
  }
} 