import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { HistoricalService } from './historical.service';
import { Response } from 'express';

@Controller('historical')
export class HistoricalController {
  constructor(private historicalService: HistoricalService) {}

  @Get(':id/pdf')
  async getPDF(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const buffer = await this.historicalService.generatePDF(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
  @Get(':id')
  async getHistorical(@Param('id') id: string) {
    const historical = await this.historicalService.getHistoricalById(id);
    if (!historical) throw new NotFoundException('Patient not found');
    return historical;
  }
  @Post(':id')
  async createHistorical(@Param('id') id: string, @Body() content) {
    try {
      return this.historicalService.seveHistorical(id, content);
    } catch (error) {
      throw new NotFoundException('Patient does not exist');
    }
  }
}
