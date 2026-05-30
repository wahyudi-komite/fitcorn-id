import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('app.facebook.clientId') || 'DUMMY_CLIENT_ID',
      clientSecret: configService.get<string>('app.facebook.clientSecret') || 'DUMMY_CLIENT_SECRET',
      callbackURL: configService.get<string>('app.facebook.callbackUrl') || 'http://localhost:3000/api/auth/facebook/callback',
      scope: ['email', 'public_profile'],
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;
    done(null, {
      provider: 'facebook',
      providerId: id,
      email: emails?.[0]?.value || null,
      fullName: displayName || 'Facebook User',
      avatar: photos?.[0]?.value || null,
    });
  }
}
