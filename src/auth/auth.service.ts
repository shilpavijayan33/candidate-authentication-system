import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../candidate/candidate.entity';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../redis/otp.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Candidate)
    private repo: Repository<Candidate>,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async sendOtp(email: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Candidate not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpService.setOtp(email, otp);

    console.log(`OTP for ${email}: ${otp}`);
    return { message: 'OTP sent' };
  }

  async verifyOtp(email: string, otp: string) {
    const storedOtp = await this.otpService.getOtp(email);
    if (!storedOtp || storedOtp !== otp)
      throw new BadRequestException('Invalid or expired OTP');

    await this.repo.update({ email }, { isOtpVerified: true });
    await this.otpService.deleteOtp(email);

    return { message: 'OTP verified' };
  }

  async setPassword(email: string, password: string, confirm: string) {
    if (password !== confirm)
      throw new BadRequestException('Passwords do not match');

    const user = await this.repo.findOne({ where: { email } });
    if (!user || !user.isOtpVerified)
      throw new UnauthorizedException('OTP verification required');

    user.password = await bcrypt.hash(password, 10);
    return this.repo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user || !user.password)
      throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { accessToken: token };
  }
}
