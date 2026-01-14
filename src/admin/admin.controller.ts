import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('candidates')
  create(@Body() body: { name: string; email: string }) {
    return this.adminService.createCandidate(body);
  }
}
