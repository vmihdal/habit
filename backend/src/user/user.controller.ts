import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name?: string }) {
    try {
      const user = await this.userService.createUser(body.email, body.password, body.name);
      const payload = { userId: user.id };
      const token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET });
      return { token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.userService.validateUser(body.email, body.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { userId: user.id };
      const token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET });
      return { token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
} 