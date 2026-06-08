import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnergyPackage } from '../entities/energy-package.entity';
import { PlatformWallet } from '../entities/platform-wallet.entity';
import { Order } from '../entities/order.entity';
import axios from 'axios';
const { TronWeb } = require('tronweb');

@Injectable()
export class TronService implements OnModuleInit {
  private tronWeb: any;
  
  // ─── CẤU HÌNH BỘ NHỚ ĐỆM CACHE GIÁ GỐC (5 PHÚT) ───
  private cachedPriceInSun: number | null = null;
  private lastFetchedTime: number = 0;
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 phút quy đổi ra mili-giây

  constructor(
    @InjectRepository(EnergyPackage)
    private readonly packageRepo: Repository<EnergyPackage>,
    @InjectRepository(PlatformWallet)
    private readonly walletRepo: Repository<PlatformWallet>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {
    this.tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
    });
  }

  onModuleInit() {
    // Quét Blockchain TRON tìm giao dịch nạp tiền sau mỗi 15 giây
    setInterval(() => this.checkIncomingTransactions(), 15000);
    console.log('⚡ Hệ thống lắng nghe Blockchain TRON (Tối ưu Cache 5m) đã kích hoạt!');
  }

  /**
   * Hàm lấy giá từ đối tác Netts có áp dụng cơ chế Cache bảo vệ hệ thống
   */
  private async getNettsPriceInSun(): Promise<number> {
    const now = Date.now();

    // Nếu đã có giá lưu trong cache VÀ chưa quá thời hạn 5 phút -> Trả về luôn
    if (this.cachedPriceInSun !== null && (now - this.lastFetchedTime) < this.CACHE_TTL_MS) {
      console.log(`⏱️ [CACHE HIT] Sử dụng giá Netts từ bộ nhớ đệm: ${this.cachedPriceInSun} SUN`);
      return this.cachedPriceInSun;
    }

    // Nếu hết hạn cache hoặc chưa có dữ liệu, mới thực hiện gọi API sang đối tác
    try {
      const apiKey = process.env.NETTS_API_KEY || '';
      const whitelistIp = process.env.SERVER_IP || '127.0.0.1';

      console.log('🌐 [CACHE MISS] Đang gọi API Netts.io để cập nhật giá mới nhất...');
      const response = await axios.get('https://netts.io/apiv2/pricing?services=energy_1h', {
        headers: {
          'X-API-KEY': apiKey,
          'X-Real-IP': whitelistIp,
        },
      });

      if (response.data && response.data.success) {
        const periods = response.data.data?.services?.energy_1h?.periods;
        if (periods) {
          const currentPeriod = periods.find((p: any) => p.is_current === true);
          if (currentPeriod) {
            // Lưu giá trị mới vào cache và cập nhật mốc thời gian
            this.cachedPriceInSun = currentPeriod.price;
            this.lastFetchedTime = now;
            return this.cachedPriceInSun!;
          }
        }
      }
      
      // Nếu API trả về lỗi cấu trúc nhưng cache cũ đã có giá, dùng tạm giá cũ để hệ thống không gián đoạn
      return this.cachedPriceInSun ?? 110;
    } catch (error) {
      console.error('❌ Lỗi khi lấy bảng giá Netts pricing:', error instanceof Error ? error.message : String(error));
      return this.cachedPriceInSun ?? 110; // Fallback an toàn giữ mạch chạy hệ thống
    }
  }

  /**
   * Tiến trình quét lịch sử ví nhận tiền QR
   */
  async checkIncomingTransactions() {
    try {
      const wallet = await this.walletRepo.findOne({ where: { id: 1 as any } });
      if (!wallet || !wallet.qrAddress) return;

      const txUrl = `https://api.trongrid.io/v1/accounts/${wallet.qrAddress}/transactions?limit=10&confirmed=true`;
      const response = await axios.get(txUrl);
      const transactions = response.data?.data;
      if (!transactions || transactions.length === 0) return;

      for (const tx of transactions) {
        const txId = tx.txID;

        // Bỏ qua nếu giao dịch đã từng xử lý
        const isExisted = await this.orderRepo.findOne({ where: { txId } });
        if (isExisted) continue;

        const rawData = tx.raw_data?.contract?.[0]?.parameter?.value;
        if (!rawData) continue;

        const toAddress = this.tronWeb.address.fromHex(rawData.to_address);
        if (toAddress !== wallet.qrAddress) continue;

        const fromAddress = this.tronWeb.address.fromHex(rawData.owner_address);
        const amountTrx = rawData.amount / 1000000; // Quy đổi đơn vị sun sang TRX

        if (amountTrx <= 0) continue;

        console.log(`📥 Phát hiện giao dịch mới: ${amountTrx} TRX từ ví người dùng: ${fromAddress}`);
        
        // Kích hoạt tiến trình check giá và thực thi đơn hàng
        await this.processEnergyPurchase(txId, fromAddress, amountTrx);
      }
    } catch (err) {
      console.error('❌ Lỗi quét dữ liệu Blockchain TRON:', err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Khớp gói năng lượng tối ưu và gọi API mua hàng
   */
  private async processEnergyPurchase(txId: string, userAddress: string, amountTrx: number) {
    // Lấy giá vốn an toàn qua hàm Cache
    const priceInSun = await this.getNettsPriceInSun();

    // Lấy danh sách gói hệ thống, xếp tăng dần theo giá tiền
    const packages = await this.packageRepo.find({
      where: { isActive: true },
      order: { priceInTrx: 'ASC' },
    });

    if (packages.length === 0) return;

    let selectedPackage: EnergyPackage | null = null;

    // THUẬT TOÁN HƠN TIỀN LẤY GÓI GẦN NHẤT: Tìm cấu hình gói cao nhất mà số tiền user nạp vào vẫn đủ mua
    for (const pkg of packages) {
      if (amountTrx >= pkg.priceInTrx) {
        selectedPackage = pkg;
      }
    }

    // Gửi thiếu tiền cho gói thấp nhất -> Hủy đơn
    if (!selectedPackage) {
      console.log(`⚠️ Giao dịch ${txId} nạp vào ${amountTrx} TRX không đủ mua gói thấp nhất hệ thống.`);
      const failedOrder = this.orderRepo.create({
        txId,
        userAddress,
        amountTrx,
        energyPackageId: 'NONE', // Không có gói phù hợp
        costPriceInTrx: 0,
        status: 'FAILED_INSUFFICIENT_FUNDS', // Trạng thái: Lỗi không đủ tiền mua gói tối thiểu
      });
      await this.orderRepo.save(failedOrder);
      return;
    }

    // Tính toán giá vốn thực tế dựa trên giá đối tác (TRX = (giá_sun / 1,000,000) * dung_lượng_gói)
    const energyAmountNum = parseInt(selectedPackage.energyAmount);
    const calculatedCost = (priceInSun / 1000000) * energyAmountNum;

    // Khởi tạo và lưu đơn hàng tạm thời vào Database với trạng thái PROCESSING
    const order = this.orderRepo.create({
      txId,
      userAddress,
      amountTrx,
      energyPackageId: selectedPackage.id.toString(),
      costPriceInTrx: parseFloat(calculatedCost.toFixed(6)),
      status: 'PROCESSING',
    });
    await this.orderRepo.save(order);

    // TIẾN HÀNH GỌI API NETTS ĐỂ THỰC THI CHUYỂN NĂNG LƯỢNG CHO KHÁCH
    try {
      const nettsOrderUrl = 'https://netts.io/apiv2/order1h';
      const apiKey = process.env.NETTS_API_KEY || '';
      const whitelistIp = process.env.SERVER_IP || '127.0.0.1';

      console.log(`🤖 Đang đẩy đơn mua ${energyAmountNum} NL tới Netts cho địa chỉ người dùng: ${userAddress}`);

      const response = await axios.post(
        nettsOrderUrl,
        {
          amount: energyAmountNum,
          receiveAddress: userAddress, // Người nhận tự động bóc tách từ ví gửi block
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
            'X-Real-IP': whitelistIp,
          },
        },
      );

      if (response.status === 200 || response.data?.success) {
        order.status = 'SUCCESS';
        order.nettsOrderId = response.data?.orderId || 'SUCCESS_API';
        await this.orderRepo.save(order);
        console.log(`✅ Thành công! Đã mua và nạp tài nguyên cho ví khách hàng: ${userAddress}`);
      } else {
        throw new Error(response.data?.message || 'Netts API returned failure code.');
      }
    } catch (error) {
      // Bảo mật kiểu dữ liệu TypeScript nghiêm ngặt (Type-safe)
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ Thất bại khi thực thi API mua hàng Netts:`, errorMsg);
      
      order.status = 'FAILED';
      await this.orderRepo.save(order);
    }
  }
}