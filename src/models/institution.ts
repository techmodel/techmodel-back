import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { City } from './city';
import { InstitutionType } from './institutionType';
import { Location } from './location';
import { PopulationType } from './populationType';
import { ProgramToInstitution } from './programToInstitution';
import { User } from './user';
import { VolunteerRequest } from './volunteerRequest';

@Entity()
export class Institution {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_institution' })
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  locationId: number;

  @Column()
  cityId: number;

  @ManyToOne(
    () => Location,
    location => location.institutions
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_institution_location_id'
  })
  location: Location;

  @ManyToOne(
    () => City,
    city => city.institutions
  )
  @JoinColumn({
    foreignKeyConstraintName: 'FK_institution_city_id'
  })
  city: City;

  @Column({ type: 'varchar' })
  populationType: PopulationType;

  @Column({ type: 'varchar' })
  institutionType: InstitutionType;

  @OneToMany(
    () => User,
    user => user.company
  )
  users?: User[];

  @OneToMany(
    () => VolunteerRequest,
    volunteerRequest => volunteerRequest.program
  )
  volunteerRequests?: VolunteerRequest[];

  @OneToMany(
    () => ProgramToInstitution,
    programToInstitution => programToInstitution.institution
  )
  programToInstitution?: ProgramToInstitution[];
}
