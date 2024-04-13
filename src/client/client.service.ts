import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from './../prisma/prisma.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Client } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async getAllClients(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }
  async getClientById(id: string): Promise<Client> {
    return this.prisma.client.findUnique({ where: { id } });
  }
  async addClient(data: Client): Promise<Client> {
    return this.prisma.client.create({ data });
  }
  async updateClient(id: string, data: Client): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }
  async removeClient(id: string): Promise<Client> {
    return this.prisma.client.delete({ where: { id } });
  }
}
