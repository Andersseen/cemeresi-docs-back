import { Module } from '@nestjs/common';
import { HistoricalController } from './historical.controller';
import { HistoricalService } from './historical.service';
import { ClientModule } from 'src/client/client.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ClientModule, PrismaModule],
  controllers: [HistoricalController],
  providers: [HistoricalService],
})
export class HistoricalModule {}
