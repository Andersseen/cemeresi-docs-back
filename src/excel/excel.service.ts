import { Injectable } from '@nestjs/common';
import { Client } from 'prisma-client';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class ExcelService {
    constructor(private clientService: ClientService) {}

    async addManyClients(data: Client[]) {        
        return this.clientService.addManyClients([...data]);
      }
}
