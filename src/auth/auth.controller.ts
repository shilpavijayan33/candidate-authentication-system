import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-otp')
  sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  verifyOtp(@Body() body) {
    return this.authService.verifyOtp(body.email, body.otp);
  }

  @Post('set-password')
  setPassword(@Body() body) {
    return this.authService.setPassword(
      body.email,
      body.password,
      body.confirmPassword,
    );
  }

  @Post('login')
  login(@Body() body) {
    return this.authService.login(body.email, body.password);
  }
}
