import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { EnergyPackage } from '../entities/energy-package.entity'; 
import { PlatformWallet } from '../entities/platform-wallet.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([EnergyPackage, PlatformWallet]),
  ],
  providers: [TelegramService]
})
export class TelegramModule {}
