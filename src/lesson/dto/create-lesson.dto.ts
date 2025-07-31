import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ example: 'Introduction to Prompt Engineering' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/document.pdf' })
  @IsOptional()
  pdfDocumentUrl?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  courseId: number;
}
