import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TronModule } from './tron/tron.module';
import { TelegramModule } from './telegram/telegram.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [TronModule, TelegramModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
