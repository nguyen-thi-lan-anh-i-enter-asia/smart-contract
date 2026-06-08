import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('energy_packages')
export class EnergyPackage {
  @PrimaryGeneratedColumn('uuid') // Dùng UUID giống hệt như chuỗi id của API gốc
  id: string;

  @Column()
  name: string;

  @Column()
  energyAmount: string; // "65000"

  @Column({ type: 'float' })
  priceInTrx: number;

  @Column({ default: 1 })
  durationHours: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: 0 })
  savingsPercent: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}