import { IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  videoUrl?: string;

  @IsOptional()
  pdfDocumentUrl?: string;

  @IsString()
  courseId: number;
}
