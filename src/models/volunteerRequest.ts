import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt!: Date;

  // TODO: add foreign key
  @Column()
  creator: number;

  @Column()
  name: string;

  @Column()
  audience: number;

  @Column()
  isPhysical: boolean;

  @Column()
  description: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column()
  duration: string; // TODO: decide on the type of the column

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column()
  volunteerAmount: string; // TODO: think about a better name, maybe attendees? participants?

  @Column()
  status: string;
}
