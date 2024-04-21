import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { Patient } from 'prisma-client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async getAllClients(): Promise<Patient[]> {
    return this.prisma.patient.findMany();
  }
  async getClientById(id: string): Promise<Patient> {
    const numberId = Number(id);
    return this.prisma.patient.findUnique({ where: { id: numberId } });
  }
  async addClient(data: Patient): Promise<Patient> {
    return this.prisma.patient.create({ data });
  }
  async addManyClients(data: Patient[]) {
    return this.prisma.patient.createMany({
      data: [...data],
      skipDuplicates: true,
    });
  }
  async updateClient(id: string, data: Patient): Promise<Patient> {
    const numberId = Number(id);
    return this.prisma.patient.update({
      where: { id: numberId },
      data,
    });
  }
  async removeClient(id: string): Promise<Patient> {
    const numberId = Number(id);
    return this.prisma.patient.delete({ where: { id: numberId } });
  }
}
