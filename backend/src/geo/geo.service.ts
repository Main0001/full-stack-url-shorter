import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { envConfig } from '../config/env.config';

export interface GeoData {
  country: string | null;
  city: string | null;
}

interface IpApiResponse {
  status: 'success' | 'fail';
  country: string;
  city: string;
  query: string;
}

@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);

  constructor(private httpService: HttpService) {}

  async getGeoByIp(ip: string): Promise<GeoData> {
    // Skip geo lookup for localhost
    if (!ip || ip === '::1' || ip === '127.0.0.1') {
      return { country: null, city: null };
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IpApiResponse>(
          `http://ip-api.com/json/${ip}?fields=status,country,city`,
          { timeout: envConfig.geoTimeout },
        ),
      );

      if (data.status !== 'success') {
        return { country: null, city: null };
      }

      return {
        country: data.country ?? null,
        city: data.city ?? null,
      };
    } catch (error) {
      this.logger.warn(`Geo lookup failed for IP ${ip}: ${error.message}`);
      return { country: null, city: null };
    }
  }
}
