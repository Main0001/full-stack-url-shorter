import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: { email: string; password: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  updateRefreshToken(id: string, refreshToken: string | null): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { refreshToken } });
  }
}
