import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
          description: 'User email address'
        },
        password: {
          type: 'string',
          example: 'Password123!',
          description: 'User password (min 8 characters)'
        },
        name: {
          type: 'string',
          example: 'John Doe',
          description: 'User full name',
        }
      },
      required: ['email', 'password']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data'
  })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
          description: 'User email address'
        },
        password: {
          type: 'string',
          example: 'Password123!',
          description: 'User password'
        }
      },
      required: ['email', 'password']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid credentials'
  })
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