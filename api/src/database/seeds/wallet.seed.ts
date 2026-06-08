import { Repository } from 'typeorm';
import { PlatformWallet } from '../../entities/platform-wallet.entity';

export async function seedPlatformWallets(repository: Repository<PlatformWallet>) {
  // Dọn sạch bảng cũ
  await repository.clear();

  // Khởi tạo dòng ví mặc định ban đầu
  await repository.save({
    id: 1,
    tronlinkAddress: "TLcKpPnoZAAAVTn8m9y9WmWeUUxuSWb2pj",
    qrAddress: "TYTP33v3vYnJ1JPxGC6RJYniyzX5rCLybg"
  });
  console.log('✅ [WalletSeed] Đã dọn dẹp và nạp mới ví mặc định thành công!');
}