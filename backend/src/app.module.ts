import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { LinksModule } from './modules/links/links.module';
import { GeoModule } from './modules/geo/geo.module';
import { ClicksModule } from './modules/clicks/clicks.module';
import { RedirectModule } from './modules/redirect/redirect.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    LinksModule,
    GeoModule,
    ClicksModule,
    RedirectModule,
    StatsModule,
  ],

})
export class AppModule {}
