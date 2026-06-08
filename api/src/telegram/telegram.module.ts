import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { EnergyPackage } from '../entities/energy-package.entity'; 
import { PlatformWallet } from '../entities/platform-wallet.entity';
@Module({
  imports: [
    // Đăng ký Repository của 2 thực thể vào Module này để TelegramService có thể inject được
    TypeOrmModule.forFeature([EnergyPackage, PlatformWallet]),
  ],
  providers: [TelegramService]
})
export class TelegramModule {}
