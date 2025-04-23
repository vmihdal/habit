import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HabitService } from './habit.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Controller('habits')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  create(@Body() createHabitDto: CreateHabitDto) {
    // TODO: Get userId from JWT token
    const userId = 1; // Temporary
    return this.habitService.create(userId, createHabitDto);
  }

  @Get()
  findAll() {
    // TODO: Get userId from JWT token
    const userId = 1; // Temporary
    return this.habitService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Get userId from JWT token
    const userId = 1; // Temporary
    return this.habitService.findOne(+id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    // TODO: Get userId from JWT token
    const userId = 1; // Temporary
    return this.habitService.update(+id, userId, updateHabitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Get userId from JWT token
    const userId = 1; // Temporary
    return this.habitService.remove(+id, userId);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    // TODO: Get userId from JWT token
    const userId = 1; // Temporary
    return this.habitService.getHabitStats(userId, +id);
  }
} 