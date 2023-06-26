import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UUID } from 'crypto';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginMobileFirst(@Body() { mobile }: any) {
    return await this.authService.firstStepLogin(mobile);
  }

  @Post('login/:id')
  async loginMobileSecond(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() { OTP }: any,
  ): Promise<{ token: string }> {
    const token = await this.authService.secondStepLogin(id, OTP);
    return { token };
  }
}
