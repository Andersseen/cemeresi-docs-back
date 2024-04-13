import { PrismaModule } from 'src/prisma/prisma.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
