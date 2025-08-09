import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';
import { IsOptional, IsString, IsUrl, IsInt } from 'class-validator';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  @IsOptional()
  @IsString()
  title?: string;

  // @ApiProperty({ example: 'c5b9b55e-6918-4964-ab09-fa32554cf982' })
  // @IsString()
  // courseId: string;

  // @IsOptional()
  // @IsUrl()
  // videoUrl?: string;

  // @IsOptional()
  // @IsUrl()
  // pdfDocumentUrl?: string;

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
