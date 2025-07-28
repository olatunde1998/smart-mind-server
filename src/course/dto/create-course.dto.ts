import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLessonDto } from 'src/lesson/dto/create-lesson.dto';

export class CreateCourseDto {
  @IsString()
  courseName: string;

  @IsString()
  courseBannerUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  lessons: CreateLessonDto[];
}
