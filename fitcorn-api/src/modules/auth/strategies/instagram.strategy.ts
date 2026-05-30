import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const CustomStrategy: any = require('passport-custom').Strategy;

@Injectable()
export class InstagramStrategy extends PassportStrategy(CustomStrategy, 'instagram') {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly callbackUrl: string;
  private readonly authorizeUrl = 'https://api.instagram.com/oauth/authorize';
  private readonly tokenUrl = 'https://api.instagram.com/oauth/access_token';
  private readonly graphUrl = 'https://graph.instagram.com/me';

  constructor(configService: ConfigService) {
    super();
    this.clientId = configService.get<string>('app.instagram.clientId') || '';
    this.clientSecret = configService.get<string>('app.instagram.clientSecret') || '';
    this.callbackUrl = configService.get<string>('app.instagram.callbackUrl') || '';
  }

  getAuthorizeUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      scope: 'user_profile',
      response_type: 'code',
      state,
    });
    return `${this.authorizeUrl}?${params.toString()}`;
  }

  async validate(req: any): Promise<any> {
    const { code } = req.query;
    if (!code) {
      throw new Error('No authorization code provided');
    }

    // Exchange code for short-lived access token
    const tokenRes = await axios.post(this.tokenUrl, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.callbackUrl,
      code,
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const accessToken = tokenRes.data.access_token;
    const userId = tokenRes.data.user_id;

    // Fetch user profile
    const profileRes = await axios.get(this.graphUrl, {
      params: {
        fields: 'id,username',
        access_token: accessToken,
      },
    });

    return {
      provider: 'instagram',
      providerId: userId?.toString() || profileRes.data.id,
      email: null,
      fullName: profileRes.data.username || 'Instagram User',
      avatar: null,
    };
  }
}
