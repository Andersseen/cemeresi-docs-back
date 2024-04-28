import { ExcelModule } from './excel/excel.module';
import { ClientModule } from './client/client.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HistoricalModule } from './historical/historical.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ExcelModule,
    ClientModule,
    HistoricalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
