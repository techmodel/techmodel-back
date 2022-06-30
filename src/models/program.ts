import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;
}
