import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { ClientService } from './client.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Client } from '@prisma/client';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  getAllClient() {
    return this.clientService.getAllClients();
  }

  // findOne(@Param('id') id: string):  Client {
  @Get(':id')
  async getClient(@Param('id') id: string) {
    return this.clientService.getClientById(id);
  }

  @Post()
  createClient(@Body() Client_singular: Client) {
    this.clientService.addClient(Client_singular);
  }

  @Put()
  updateClient_singular(
    @Param('id') id: string,
    @Body() Client_singular: Client,
  ) {
    this.clientService.updateClient(id, Client_singular);
  }

  /**
   * Delete Client_singular
   * @param id
   */
  @Delete()
  deleteClient_singular(@Param('id') id: string) {
    this.clientService.removeClient(id);
  }
}
