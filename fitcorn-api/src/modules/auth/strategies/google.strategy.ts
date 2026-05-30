import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('app.google.clientId') || 'DUMMY_CLIENT_ID',
      clientSecret: configService.get<string>('app.google.clientSecret') || 'DUMMY_CLIENT_SECRET',
      callbackURL: configService.get<string>('app.google.callbackUrl') || 'http://localhost:3000/api/auth/google/callback',
      scope: ['profile', 'email'],
    } as StrategyOptions);
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;
    done(null, {
      provider: 'google',
      providerId: id,
      email: emails?.[0]?.value || null,
      fullName: name?.givenName
        ? `${name.givenName} ${name.familyName || ''}`.trim()
        : profile.displayName || 'Google User',
      avatar: photos?.[0]?.value || null,
    });
  }
}
