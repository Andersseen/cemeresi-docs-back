import { ClientModule } from './client/client.module';
import { ClientController } from './client/client.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ClientModule],
  controllers: [ClientController, AppController],
  providers: [AppService],
})
export class AppModule {}
