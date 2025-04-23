import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(email: string, password: string, name?: string): Promise<{
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findUserByEmail(email: string): Promise<{
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    validateUser(email: string, password: string): Promise<{
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
