import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CloudinaryService } from 'src/utils/cloudinary.service';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createLessonDto: CreateLessonDto,
    files: { video?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
  ): Promise<Lesson> {
    if (files.video?.[0]) {
      const videoUrl = await this.cloudinaryService.uploadFile(
        files.video[0],
        'lessons/videos',
      );
      createLessonDto.videoUrl = videoUrl;
    }

    if (files.pdf?.[0]) {
      const pdfUrl = await this.cloudinaryService.uploadFile(
        files.pdf[0],
        'lessons/pdfs',
      );
      createLessonDto.pdfDocumentUrl = pdfUrl;
    }

    const lesson = this.lessonRepository.create(createLessonDto);
    return this.lessonRepository.save(lesson);
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonRepository.find({ relations: ['course'] });
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async update(
    id: string,
    updateLessonDto: UpdateLessonDto,
    files?: { video?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
  ): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    console.log('lesson', lesson);
    if (!lesson) throw new NotFoundException('Lesson not found');

    if (files?.video?.[0]) {
      lesson.videoUrl = await this.cloudinaryService.uploadFile(
        files.video[0],
        'lessons/videos',
      );
    }

    if (files?.pdf?.[0]) {
      lesson.pdfDocumentUrl = await this.cloudinaryService.uploadFile(
        files.pdf[0],
        'lessons/pdfs',
      );
    }

    for (const [key, value] of Object.entries(updateLessonDto)) {
      if (
        value !== undefined &&
        value !== '' &&
        key !== 'video' &&
        key !== 'pdf'
      ) {
        (lesson as any)[key] = value;
      }
    }

    const updatedLesson = this.lessonRepository.merge(lesson, updateLessonDto);
    return this.lessonRepository.save(updatedLesson);
  }

  async remove(id: string): Promise<void> {
    const lesson = await this.findOne(id);
    await this.lessonRepository.remove(lesson);
  }
}
