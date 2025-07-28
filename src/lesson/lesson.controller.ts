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
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { LessonService } from './lesson.service';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { Readable } from 'stream';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
    @Body() createLessonDto: CreateLessonDto,
  ) {
    // === File Type Validation ===
    const videoFile = files?.video?.[0];
    const pdfFile = files?.pdf?.[0];

    if (videoFile && videoFile.mimetype !== 'video/mp4') {
      throw new BadRequestException('Only MP4 videos are allowed');
    }

    if (pdfFile && pdfFile.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    // === Upload to Cloudinary ===
    const uploadToCloudinary = (file: Express.Multer.File, folder: string) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url);
          },
        );
        Readable.from(file.buffer).pipe(stream);
      });
    };

    if (videoFile) {
      const videoUrl = await uploadToCloudinary(videoFile, 'videos');
      createLessonDto.videoUrl = videoUrl as string;
    }

    if (pdfFile) {
      const pdfUrl = await uploadToCloudinary(pdfFile, 'pdfs');
      createLessonDto.pdfDocumentUrl = pdfUrl as string;
    }

    return this.lessonService.create(createLessonDto);
  }

  @Get()
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(+id, updateLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
}
