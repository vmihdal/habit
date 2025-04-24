import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HabitModule } from './habit/habit.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    HabitModule,
    UserModule
  ],
})
export class AppModule {} 