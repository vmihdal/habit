import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto, UpdateUserDto } from './dto/user.dto';
import { HabitDto } from '../habit/dto/habit.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        habits: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      habits: user.habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        startDate: habit.startDate,
        endDate: habit.endDate,
        frequency: habit.frequency,
        reminder: habit.reminder,
        status: habit.status,
        targetDays: habit.targetDays,
        color: habit.color,
      } as HabitDto)),
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const updateData: any = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        habits: true,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      habits: updatedUser.habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        startDate: habit.startDate,
        endDate: habit.endDate,
        frequency: habit.frequency,
        reminder: habit.reminder,
        status: habit.status,
        targetDays: habit.targetDays,
        color: habit.color,
      } as HabitDto)),
    };
  }
} 