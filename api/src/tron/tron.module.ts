import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TronService } from './tron.service';
import { EnergyPackage } from '../entities/energy-package.entity'; 
import { PlatformWallet } from '../entities/platform-wallet.entity';
import { Order } from '../entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnergyPackage, PlatformWallet, Order]),],
  providers: [TronService]
})
export class TronModule {}
