import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Institution {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  name: string;

  // TODO: add foreign key
  @Column()
  location: number;

  // TODO: add foreign key
  @Column()
  type: number;

  // TODO: add foreign
  @Column()
  populationType: number;

  // TODO: add foreign
  @Column()
  city: number;

  @Column()
  address: string;
}
