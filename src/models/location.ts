import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Institution } from './institution';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => Institution,
    institution => institution.location
  )
  institutions?: Institution[];
}
