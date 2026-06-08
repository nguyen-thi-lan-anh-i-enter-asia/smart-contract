import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('platform_wallets')
export class PlatformWallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tronlinkAddress: string;

  @Column()
  qrAddress: string;
}