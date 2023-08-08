import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('releases')
export class Release {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  version: string;

  @Column()
  filename: string;

  @Column({
    nullable: true,
  })
  notes: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  constructor(
    id: string,
    version: string,
    notes: string,
    createdDate: Date,
    updatedDate: Date,
    deletedDate: Date,
  ) {
    this.id = id;
    this.version = version;
    this.notes = notes;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.deletedDate = deletedDate;
  }
}
