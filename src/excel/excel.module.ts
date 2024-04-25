import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [ClientModule],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
