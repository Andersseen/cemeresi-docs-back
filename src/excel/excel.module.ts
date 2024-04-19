import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
