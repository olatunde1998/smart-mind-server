import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { skipAuth } from 'src/helpers/skipAuth';

@ApiTags('Lessons')
@skipAuth()
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @ApiOperation({ summary: 'Create a lesson with video and PDF upload' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ]),
  )
  @ApiResponse({
    status: 201,
    description: 'Lesson created successfully',
    type: Lesson,
  })
  @ApiBody({
    description: 'Lesson form data with optional video/pdf upload',
    schema: {
      type: 'object',
      required: ['title', 'courseId'],
      properties: {
        title: {
          type: 'string',
          example: 'Getting Started with Prompt Engineering',
        },
        courseId: {
          type: 'integer',
          example: 1,
        },
        video: {
          type: 'string',
          format: 'binary',
        },
        pdf: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.lessonService.create(createLessonDto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lesson by ID' })
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a lesson with optional video and PDF upload',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ]),
  )
  @ApiResponse({
    status: 200,
    description: 'Lesson updated successfully',
    type: Lesson,
  })
  @ApiBody({ type: UpdateLessonDto })
  update(
    @Param('id') id: string,
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.update(id, updateLessonDto, files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson' })
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
