import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ValidRoles } from '../../../auth/interfaces/valid-roles.interface';
import { Building } from '../../buildings/entities/building.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  lastname: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('date', { name: 'register_date' })
  registerDate: Date;

  @Column('bool', {
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: [ValidRoles.user],
  })
  roles: string[];

  @Column('text', {
    nullable: true,
    name: 'recover_password_token',
  })
  recoverPasswordToken?: string;

  @Column('bool', {
    default: false,
    name: 'is_verified',
  })
  isVerified: boolean;

  @Column('text', {
    nullable: true,
    default: '',
    name: 'name_profile_image',
  })
  nameProfileImage?: string;

  @Column('text', {
    nullable: true,
    default: '',
    name: 'image_url',
  })
  imageUrl?: string;

  @ManyToMany(() => Building, (building) => building.favoriteUsers, {
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'favorite_buildings',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'building_id',
      referencedColumnName: 'id',
    },
  })
  favoriteBuildings?: Building[] | null;
}
