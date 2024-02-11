import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Faculty } from '../../faculty/entities/faculty.entity';
import { Laboratory } from '../../laboratory/entities/laboratory.entity';
import { Office } from '../../office/entities/office.entity';
import { PointOfInterest } from '../../point-of-interest/entities/point-of-interest.entity';
import { User } from '../../user/entities/user.entity';

@Entity({
  name: 'buildings',
})
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { nullable: true, default: '' })
  description?: string;

  @Column('text', { nullable: true, default: '' })
  address?: string;

  @Column('int', { unique: true })
  no: number;

  @Column('float')
  longitude: number;

  @Column('float')
  latitude: number;

  @Column('text', { nullable: true, default: 'Edificio' })
  type?: string;

  @Column('text', {
    array: true,
    nullable: true,
    default: [''],
    name: 'image_names',
  })
  imageNames?: string[];

  @Column('text', {
    array: true,
    nullable: true,
    default: [''],
    name: 'image_urls',
  })
  imageUrls?: string[];

  @Column('int', { nullable: true, default: 0 })
  visits?: number;

  @OneToMany(() => Faculty, (faculty) => faculty.building, {
    eager: true,
  })
  faculties?: Faculty[];

  @OneToMany(() => Laboratory, (laboratory) => laboratory.building, {
    eager: true,
  })
  laboratories?: Laboratory[];

  @OneToMany(() => Office, (office) => office.building, {
    eager: true,
  })
  offices?: Office[];

  @OneToMany(
    () => PointOfInterest,
    (pointOfInterest) => pointOfInterest.building,
    {
      eager: true,
    },
  )
  pointOfInterests?: PointOfInterest[];

  @ManyToMany(() => User, (user) => user.favoriteBuildings, {
    nullable: true,
  })
  favoriteUsers?: User[] | null;
}
