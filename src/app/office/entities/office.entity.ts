import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';

@Entity({
  name: 'offices',
})
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true, default: '' })
  teacherName?: string;

  @Column('text')
  name: string;

  @Column('text', {
    nullable: true,
    name: 'code_or_no',
  })
  codeOrNo: string;

  @Column('text', { nullable: true, default: '' })
  schedule?: string;

  @Column('text', { nullable: true, default: '' })
  description?: string;

  @Column('text', { nullable: true, default: 'Oficina' })
  type?: string;

  @ManyToOne(() => Building, (building) => building.offices, {
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
