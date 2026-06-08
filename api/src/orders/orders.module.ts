import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnergyPackage } from '../entities/energy-package.entity';
import { PlatformWallet } from '../entities/platform-wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnergyPackage, PlatformWallet])],
  controllers: [OrdersController]
})
export class OrdersModule {}
