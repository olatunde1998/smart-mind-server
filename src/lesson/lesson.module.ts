import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { Lesson } from './entities/lesson.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/utils/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson])],
  providers: [LessonService, CloudinaryService],
  controllers: [LessonController],
})
export class LessonModule {}
