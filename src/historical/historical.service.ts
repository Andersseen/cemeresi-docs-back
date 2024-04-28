import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Historical } from 'prisma-client';
import { ClientService } from 'src/client/client.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoricalService {
  constructor(
    private prisma: PrismaService,
    private clientService: ClientService,
  ) {}
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
  }
}
