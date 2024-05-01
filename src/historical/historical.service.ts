import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PrismaService } from 'src/prisma/prisma.service';
import { Buffer } from 'buffer';
import { Historical } from 'prisma-client';

@Injectable()
export class HistoricalService {
  constructor(private prisma: PrismaService) {}
  async seveHistorical(id, text): Promise<Historical> {
    const numberId = Number(id);
    const data = {
      patientId: numberId,
      history: text.content,
    };
    try {
      const historical = await this.prisma.historical.findUnique({
        where: {
          patientId: numberId,
        },
      });
      if (historical) {
        const updateHistorical = await this.prisma.historical.update({
          where: { id: historical.id },
          data,
        });
        return updateHistorical;
      }
      const createdHistorical = await this.prisma.historical.create({ data });
      return createdHistorical;
    } catch (error) {
      throw new Error(`Error al crear el registro histórico: ${error.message}`);
    }
  }

  async getHistoricalById(id: string) {
    const numberId = Number(id);
    try {
      const historical = await this.prisma.historical.findUnique({
        where: {
          patientId: numberId,
        },
      });
      return historical;
    } catch (error) {
      throw new Error(
        `Error al obtener el registro histórico: ${error.message}`,
      );
    }
  }

  async generatePDF(id): Promise<Buffer> {
    const numberId = Number(id);
    try {
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
    } catch (error) {
      throw new Error(`Error al cgenerar registro histórico: ${error.message}`);
    }
  }
}
