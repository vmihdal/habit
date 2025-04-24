import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HabitDto as CreateHabitDto } from './dto/habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createHabitDto: CreateHabitDto) {
    return this.prisma.habit.create({
      data: {
        ...createHabitDto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.habit.findMany({
      where: { userId },
      orderBy: {
        // createdAt: 'desc',
        startDate: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    return habit;
  }

  async update(id: number, userId: number, updateHabitDto: UpdateHabitDto) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    return this.prisma.habit.update({
      where: { id },
      data: updateHabitDto,
    });
  }

  async remove(id: number, userId: number) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    return this.prisma.habit.delete({
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
    };
  }
} 