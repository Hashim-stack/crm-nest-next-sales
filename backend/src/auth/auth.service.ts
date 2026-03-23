import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(data: any) {
    const existing = await this.users.findByEmail(data.email);
    if (existing) throw new UnauthorizedException('Email already registered');
    data.password = await bcrypt.hash(data.password, 10);
    const user = await this.users.create(data);
    const { password, ...result } = user as any;
    return result;
  }

  async login(data: any) {
    const user = await this.users.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwt.sign({ id: user.id, role: user.role });
    const { password, ...userInfo } = user as any;
    return { token, user: userInfo };
  }
}