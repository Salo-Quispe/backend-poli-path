import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';

@Entity({
  name: 'point_of_interests',
})
export class PointOfInterest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true, default: '' })
  description?: string;

  @Column('text', { nullable: true, default: 'Punto de interés' })
  type?: string;

  @ManyToOne(() => Building, (building) => building.pointOfInterests, {
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
