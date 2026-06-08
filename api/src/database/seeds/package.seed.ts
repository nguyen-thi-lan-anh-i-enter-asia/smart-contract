import { Repository } from 'typeorm';
import { EnergyPackage } from '../../entities/energy-package.entity';

export async function seedEnergyPackages(repository: Repository<EnergyPackage>) {
  // Dọn sạch bảng cũ
  await repository.clear();
  
  // Bơm dữ liệu mới chuẩn JSON
  await repository.save([
    {
      id: "f14c7fd8-9e4c-4a98-a6b2-0161fea3e861",
      name: "65,000 Energy",
      energyAmount: "65000",
      priceInTrx: 3,
      durationHours: 1,
      isActive: true,
      displayOrder: 1,
      savingsPercent: 78
    },
    {
      id: "5497bd36-2453-46cc-b1c5-23039233d53c",
      name: "131,000 Energy",
      energyAmount: "131000",
      priceInTrx: 5.6,
      durationHours: 1,
      isActive: true,
      displayOrder: 2,
      savingsPercent: 80
    },
    {
      id: "65ed64cb-5c72-4562-885d-a3d30a567498",
      name: "195,000 Energy",
      energyAmount: "195000",
      priceInTrx: 8.5,
      durationHours: 1,
      isActive: true,
      displayOrder: 3,
      savingsPercent: 80
    },
    {
      id: "59d97f5d-b8df-4263-9d01-479e2236b2da",
      name: "260,000 Energy",
      energyAmount: "260000",
      priceInTrx: 11,
      durationHours: 1,
      isActive: true,
      displayOrder: 4,
      savingsPercent: 82
    }
  ]);
  console.log('✅ [PackageSeed] Đã dọn dẹp và nạp mới 4 gói package thành công!');
}