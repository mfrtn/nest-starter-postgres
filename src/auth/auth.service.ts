import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { UUID, randomUUID } from 'crypto';

import { cachedData } from './interfaces/types';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  private ttl = this.configService.get<number>('REDIS_EXPIRE_TIME') ?? 120000;

  generateJwt(mobile: string): string {
    return this.jwtService.sign({ mobile });
  }
  generateCachedData(mobile: string): cachedData {
    const randomId = randomUUID();
    const randomKey = Math.floor(100000 + Math.random() * 900000).toString();

    return {
      randomId,
      data: {
        mobile,
        randomKey,
      },
    };
  }

  async firstStepLogin(mobile: string) {
    const user = await this.userService.findUserByMobile(mobile);
    if (user) {
      const { randomId, data } = this.generateCachedData(mobile);
      console.log('OTP KEY: ', data.randomKey);
      await this.cacheManager.set(randomId, JSON.stringify(data), this.ttl);
      return { OTP: randomId };
    } else {
      throw new ForbiddenException('Invalid mobile number');
    }
  }

  async secondStepLogin(id: UUID, OTP: string): Promise<string> {
    const data = (await this.cacheManager.get(id)) as string;
    if (data) {
      const { mobile, randomKey } = JSON.parse(data);
      if (randomKey === OTP) {
        await this.cacheManager.del(id);
        return this.generateJwt(mobile);
      }
    }
    throw new ForbiddenException('Invalid OTP');
  }
}
