import { Injectable } from '@nestjs/common';
import { Patient } from 'prisma-client';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class ExcelService {
  constructor(private clientService: ClientService) {}

  async addManyClients(data: Patient[]) {
    return this.clientService.addManyClients([...data]);
  }
}
