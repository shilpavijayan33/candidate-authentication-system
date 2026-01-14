import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../candidate/candidate.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Candidate)
    private repo: Repository<Candidate>,
  ) {}

  async createCandidate(data: { name: string; email: string }) {
    const exists = await this.repo.findOne({ where: { email: data.email } });
    if (exists) throw new BadRequestException('Email already exists');

    return this.repo.save(this.repo.create(data));
  }
}
