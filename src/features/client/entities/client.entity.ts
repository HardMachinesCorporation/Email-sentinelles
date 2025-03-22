import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';

@Entity('Client')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;
  @Index()
  @Column({ unique: true, nullable: true })
  email: string;
  @Column()
  password: string;
  @Column()
  name: string;
  @VersionColumn()
  version: number;
  @DeleteDateColumn({ nullable: true }) // S'assure que deletedAt peut être NULL en DB
  deletedAt: Date | null;
}
