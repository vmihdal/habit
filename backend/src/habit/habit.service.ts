import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto, HabitDto } from './dto/habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createHabitDto: CreateHabitDto): Promise<HabitDto> {
    const habit = await this.prisma.habit.create({
      data: {
        userId,
        name: createHabitDto.name,
        frequency: createHabitDto.frequency,
        startDate: createHabitDto.startDate,
        endDate: createHabitDto.endDate,
        reminder: createHabitDto.reminder,
        status: createHabitDto.status,
        targetDays: createHabitDto.targetDays,
        color: createHabitDto.color,
        customDates: createHabitDto.customDates,
        goals: {
          create: createHabitDto.goals.map(goal => ({
            name: goal.name,
            done: goal.done,
          })),
        },
      },
    });

    return {
      id: habit.id,
      name: habit.name,
      frequency: habit.frequency,
      startDate: habit.startDate,
      endDate: habit.endDate,
      reminder: habit.reminder,
      status: habit.status,
      targetDays: habit.targetDays,
      color: habit.color,
      customDates: habit.customDates,
      doneDates: [],
      goals: habit.goals,
    };
  }

  async findAll(userId: number): Promise<HabitDto[]> {
    const habits = await this.prisma.habit.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
      },
    });

    return habits.map(habit => ({
      id: habit.id,
      name: habit.name,
      frequency: habit.frequency,
      startDate: habit.startDate,
      endDate: habit.endDate,
      reminder: habit.reminder,
      status: habit.status,
      targetDays: habit.targetDays,
      color: habit.color,
      customDates: habit.customDates,
      doneDates: habit.doneDates,
      goals: habit.goals,
    }));
  }

  async findOne(id: number, userId: number): Promise<HabitDto> {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    return {
      id: habit.id,
      name: habit.name,
      frequency: habit.frequency,
      startDate: habit.startDate,
      endDate: habit.endDate,
      reminder: habit.reminder,
      status: habit.status,
      targetDays: habit.targetDays,
      color: habit.color,
      customDates: habit.customDates,
      doneDates: habit.doneDates, 
      goals: habit.goals,
    };
  }

  async update(id: number, userId: number, updateHabitDto: UpdateHabitDto): Promise<HabitDto> {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    const updatedHabit = await this.prisma.habit.update({
      where: { id },
      data: updateHabitDto,
    });

    return {
      id: updatedHabit.id,
      name: updatedHabit.name,
      frequency: updatedHabit.frequency,
      startDate: updatedHabit.startDate,
      endDate: updatedHabit.endDate,
      reminder: updatedHabit.reminder,
      status: updatedHabit.status,
      targetDays: updatedHabit.targetDays,
      color: updatedHabit.color,
      customDates: updatedHabit.customDates,  
      doneDates: updatedHabit.doneDates,
      goals: updatedHabit.goals,
    };
  }

  async remove(id: number, userId: number): Promise<void> {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    await this.prisma.habit.delete({
      where: { id },
    });
  }

  async getHabitStats(userId: number, habitId: number) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${habitId} not found`);
    }

    // Calculate days since start
    const startDate = new Date(habit.startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      daysSinceStart,
      targetDays: habit.targetDays,
      status: habit.status,
      frequency: habit.frequency,
      customDates: habit.customDates, 
      goals: habit.goals,
    };
  }
} 