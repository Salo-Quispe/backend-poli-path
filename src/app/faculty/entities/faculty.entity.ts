import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';

@Entity({
  name: 'faculties',
})
export class Faculty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { nullable: true, default: '' })
  description?: string;

  @Column('text', { nullable: true, default: 'Facultad' })
  type?: string;

  @ManyToOne(() => Building, (building) => building.faculties, {
    nullable: false,
  })
  building: Building;

  @Column('text', {
    array: true,
    nullable: true,
    default: [''],
    name: 'image_urls',
  })
  imageUrls?: string[];

  @Column('text', {
    array: true,
    nullable: true,
    default: [''],
    name: 'image_names',
  })
  imageNames?: string[];
}
