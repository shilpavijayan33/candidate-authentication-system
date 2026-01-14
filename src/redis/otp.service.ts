import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async setOtp(email: string, otp: string) {
    await this.redis.set(`otp:${email}`, otp, 'EX', 300);
  }

  async getOtp(email: string): Promise<string | null> {
    return this.redis.get(`otp:${email}`);
  }

  async deleteOtp(email: string) {
    await this.redis.del(`otp:${email}`);
  }
}
