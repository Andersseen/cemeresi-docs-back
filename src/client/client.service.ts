import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { Client } from 'prisma-client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async getAllClients(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }
  async getClientById(id: string): Promise<Client> {
    const numberId = Number(id);
    return this.prisma.client.findUnique({ where: { id: numberId } });
  }
  async addClient(data: Client): Promise<Client> {
    return this.prisma.client.create({ data });
  }
  async updateClient(id: string, data: Client): Promise<Client> {
    const numberId = Number(id);
    return this.prisma.client.update({
      where: { id: numberId },
      data,
    });
  }
  async removeClient(id: string): Promise<Client> {
    const numberId = Number(id);
    return this.prisma.client.delete({ where: { id: numberId } });
  }
}
