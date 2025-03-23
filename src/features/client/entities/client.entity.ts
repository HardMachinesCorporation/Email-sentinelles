import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { IClient } from '../interface/client.interface';

@Entity('Client')
export class Client implements IClient {
  @PrimaryGeneratedColumn()
  id!: number;
  @Index()
  @Column({ unique: true, nullable: true })
  email!: string;
  @Column()
  password!: string;
  @Column()
  name!: string;
  @VersionColumn()
  version!: number;
  @DeleteDateColumn({ nullable: true }) // S'assure que deletedAt peut être NULL en DB
  deletedAt!: Date | null;
}
