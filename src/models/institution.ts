import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { City } from './city';
import { InstitutionType } from './institutionType';
import { Location } from './location';
import { PopulationType } from './populationType';

@Entity()
export class Institution {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;

  @OneToOne(() => City)
  @JoinColumn()
  city: City;

  @Column({
    type: 'enum',
    enum: PopulationType,
    default: PopulationType.JEWISH_SECULAR
  })
  populationType: PopulationType;

  @Column({
    type: 'enum',
    enum: InstitutionType,
    default: InstitutionType.ELEMENTARY
  })
  institutionType: InstitutionType;
}
