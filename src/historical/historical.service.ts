import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
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
      const pdfBuffer: Buffer = await new Promise((resolve) => {
        const doc = new PDFDocument({
          size: 'LETTER',
          bufferPages: true,
        });

        // customize your PDF document
        doc.text(historical.history, 100, 50);
        doc.end();

        const buffer = [];
        doc.on('data', buffer.push.bind(buffer));
        doc.on('end', () => {
          const data = Buffer.concat(buffer);
          resolve(data);
        });
      });

      return pdfBuffer;
    } catch (error) {
      throw new Error(`Error al cgenerar registro histórico: ${error.message}`);
    }
  }
}
