import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  txId: string; // Mã băm giao dịch TRON block

  @Column()
  userAddress: string; // Ví của người gửi (Ví người dùng)

  @Column({ type: 'float' })
  amountTrx: number; // Số TRX thực nhận

  @Column()
  energyPackageId: string; // ID gói năng lượng hệ thống áp dụng

  @Column({ type: 'float', nullable: true })
  costPriceInTrx: number; // 🌟 LƯU GIÁ VỐN BÊN THỨ 3 TẠI ĐÂY (TRX)

  @Column({ default: 'PENDING' })
  status: string; // PENDING, PROCESSING, SUCCESS, FAILED, FAILED_INSUFFICIENT_FUNDS

  @Column({ nullable: true })
  nettsOrderId: string; // ID đơn trả về từ Netts API

  @CreateDateColumn()
  createdAt: Date;
}