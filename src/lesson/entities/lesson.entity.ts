import { Course } from '../../course/entities/course.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  pdfDocumentUrl: string;

  @ManyToOne(() => Course, (course) => course.lessons)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;
}
