import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { Patient } from 'prisma-client';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  async getAllClient() {
    try {
      return this.clientService.getAllClients();
    } catch (error) {
      throw new NotFoundException('Client does not exist');
    }
  }

  // findOne(@Param('id') id: string):  Client {
  @Get(':id')
  async getClient(@Param('id') id: string) {
    const client = await this.clientService.getClientById(id);
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  @Post()
  async createClient(@Body() Client_singular: Patient) {
    console.log(Client_singular);

    try {
      return this.clientService.addClient(Client_singular);
    } catch (error) {
      throw new NotFoundException('Client does not exist');
    }
  }

  @Put('id')
  async updateClient_singular(
    @Param('id') id: string,
    @Body() Client_singular: Patient,
  ) {
    try {
      return this.clientService.updateClient(id, Client_singular);
    } catch (error) {
      throw new NotFoundException('Client does not exist');
    }
  }

  @Delete('id')
  async deleteClient_singular(@Param('id') id: string) {
    try {
      return this.clientService.removeClient(id);
    } catch (error) {
      throw new NotFoundException('Client does not exist');
    }
  }
}
