import { ExcelModule } from './excel/excel.module';
import { ClientModule } from './client/client.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ExcelModule, ConfigModule.forRoot(), ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
