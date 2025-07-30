import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CloudinaryService } from 'src/utils/cloudinary.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    file?: Express.Multer.File,
  ): Promise<Course> {
    let courseBannerUrl = '';

    if (file) {
      const uploaded = await this.cloudinaryService.uploadFile(
        file,
        'course-banners',
      );
      courseBannerUrl = uploaded;
    }

    const course = this.courseRepository.create({
      ...createCourseDto,
      courseBannerUrl,
    });

    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({ relations: ['lessons'] });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    file?: Express.Multer.File,
  ): Promise<Course> {
    const course = await this.courseRepository.preload({
      id,
      ...updateCourseDto,
    });

    if (!course) throw new NotFoundException('Course not found');

    if (file) {
      if (course.courseBannerUrl) {
        await this.cloudinaryService.deleteFile(course.courseBannerUrl);
      }

      const uploaded = await this.cloudinaryService.uploadFile(
        file,
        'course-banners',
      );
      course.courseBannerUrl = uploaded;
    }

    return this.courseRepository.save(course);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }
}
