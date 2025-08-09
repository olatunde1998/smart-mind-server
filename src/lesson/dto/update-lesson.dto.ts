import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto extends PartialType(
  OmitType(CreateLessonDto, [
    'courseId',
    'videoUrl',
    'pdfDocumentUrl',
  ] as const),
) {
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Optional video file to replace the existing one',
  })
  video?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Optional PDF file to replace the existing one',
  })
  pdf?: any;
}
