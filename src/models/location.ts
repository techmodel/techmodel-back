import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Institution } from './institution';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(
    () => Institution,
    institution => institution.location
  )
  institution: Institution;
}
