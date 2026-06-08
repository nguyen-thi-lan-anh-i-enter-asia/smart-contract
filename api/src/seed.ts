import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { EnergyPackage } from './entities/energy-package.entity';
import { PlatformWallet } from './entities/platform-wallet.entity';
import { seedEnergyPackages } from './database/seeds/package.seed';
import { seedPlatformWallets } from './database/seeds/wallet.seed';

async function runMasterSeeder() {
  console.log('⏳ [MasterSeeder] Đang khởi động tiến trình nạp dữ liệu mồi toàn hệ thống...');
  
  // Khởi tạo ngữ cảnh ứng dụng NestJS chạy ngầm không chiếm port mạng
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Gọi Seeder 1: Xử lý phần Packages
    const packageRepo = dataSource.getRepository(EnergyPackage);
    await seedEnergyPackages(packageRepo);

    // Gọi Seeder 2: Xử lý phần Wallets
    const walletRepo = dataSource.getRepository(PlatformWallet);
    await seedPlatformWallets(walletRepo);

    console.log('🎉 [MasterSeeder] Đã hoàn thành nạp toàn bộ các cấu phần dữ liệu mẫu!');
  } catch (error) {
    console.error('❌ [MasterSeeder] Gặp lỗi nghiêm trọng trong quá trình nạp dữ liệu:', error);
  } finally {
    // Giải phóng kết nối cơ sở dữ liệu an toàn
    await app.close();
    console.log('🏁 [MasterSeeder] Tiến trình kết thúc an toàn.');
    process.exit(0);
  }
}

runMasterSeeder();