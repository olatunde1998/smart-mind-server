import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { skipAuth } from 'src/helpers/skipAuth';
import { Course } from './entities/course.entity';

@ApiTags('Courses')
@skipAuth()
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Course data and banner image',
    type: CreateCourseDto,
  })
  @ApiResponse({ status: 201, description: 'Course created' })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.courseService.create(createCourseDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Course' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 }, // generic file field
    ]),
  )
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    type: Course,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseName: {
          type: 'string',
          description: 'Name of the course',
          example: 'Prompt Engineering',
        },
        description: {
          type: 'string',
          description: 'Detailed description of the course',
          example:
            'This course introduces you to the principles and practices...',
        },
        file: {
          type: 'string',
          format: 'binary', // still 'binary' in Swagger for any file
          description: 'Any file upload',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @UploadedFiles() files: { file?: Express.Multer.File[] },
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const uploadedFile = files.file?.[0];
    return this.courseService.update(id, updateCourseDto, uploadedFile);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
