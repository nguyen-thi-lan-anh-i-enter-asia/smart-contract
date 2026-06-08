import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnergyPackage } from '../entities/energy-package.entity';
import { PlatformWallet } from '../entities/platform-wallet.entity';
import * as QRCode from 'qrcode';
@Controller('api')
export class OrdersController {
  constructor(
    @InjectRepository(EnergyPackage)
    private readonly packageRepo: Repository<EnergyPackage>,
    @InjectRepository(PlatformWallet)
    private readonly walletRepo: Repository<PlatformWallet>,
  ) {}

  // 1. API lấy danh sách packages
  @Get('packages')
  async getPackages() {
    return this.packageRepo.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  // 2. API lấy thông tin ví kèm mã QR Code động
  @Get('wallet')
  async getWallet() {
    const wallet = await this.walletRepo.findOne({ where: { id: 1 } });
    if (!wallet) {
      return { qrAddress: '', qrCodeUrl: '' };
    }

    try {
      // Sinh mã QR dưới dạng chuỗi Data URL / Base64 nguyên bản
      const qrBase64 = await QRCode.toDataURL(wallet.qrAddress, {
        errorCorrectionLevel: 'H', // Mức độ sửa lỗi cao giúp quét nhạy hơn
        margin: 1,
        width: 300,
      });

      return {
        ...wallet,
        qrCode: qrBase64, // Gán chuỗi Base64 trực tiếp vào thuộc tính này
      };
    } catch (err) {
      console.error('Lỗi khi sinh mã QR Base64:', err);
      return {
        ...wallet,
        qrCode: '',
      };
    }
  }
  
}