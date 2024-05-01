import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ClientService } from 'src/client/client.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoricalService {
  constructor(private prisma: PrismaService) {}
  async seveHistorical(id, text) {
    const numberId = Number(id);
    const data = {
      patientId: numberId,
      history: text.content,
    };
    return this.prisma.historical.create({ data });
  }

  async getHistoricalById(id: string) {
    const numberId = Number(id);
    const historical = await this.prisma.historical.findUnique({
      where: {
        patientId: numberId,
      },
    });
    return historical;
  }

  async generatePDF(id): Promise<Buffer> {
    const numberId = Number(id);
    const historical = await this.prisma.historical.findUnique({
      where: {
        patientId: numberId,
      },
    });
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(historical.history);

    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        left: '0px',
        top: '0px',
        right: '0px',
        bottom: '0px',
      },
    });

    await browser.close();

    return buffer;
  }
}
