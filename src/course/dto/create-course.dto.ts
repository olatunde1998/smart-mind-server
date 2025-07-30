import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Name of the course',
    example: 'Prompt Engineering',
  })
  @IsString()
  courseName: string;

  @ApiProperty({
    description: 'Detailed description of the course',
    example: 'This course introduces you to the principles and practices...',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Optional banner image file (image only)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  file?: any;
}
