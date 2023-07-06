import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Institution } from './institution';

@Entity()
export class City {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_city' })
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => Institution,
    institution => institution.city
  )
  institutions?: Institution[];
}
