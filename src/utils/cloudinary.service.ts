/* eslint-disable @typescript-eslint/no-unused-vars */
import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  private slugify(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/-+/g, '-');
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const isPdf = file.mimetype === 'application/pdf';
      const isVideo = file.mimetype.startsWith('video/');

      // const fileName = file.originalname.split('.').slice(0, -1).join('.');
      const originalName = path.parse(file.originalname).name;
      const safeName = this.slugify(originalName);

      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: isPdf ? 'raw' : isVideo ? 'video' : 'image',
          // type: 'upload',
          folder,
          public_id: safeName,
          // public_id: fileName,
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(stream);
    });
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(fileUrl);
      if (!publicId)
        throw new Error('Invalid file URL: Cannot extract public ID.');

      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
    } catch (err) {
      console.error('Cloudinary deletion failed:', err);
      throw err;
    }
  }

  private extractPublicId(fileUrl: string): string | null {
    try {
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      const segments = pathname.split('/');
      const filename = segments.pop();
      const folder = segments.slice(2).join('/');

      if (!filename) return null;

      const publicId = `${folder}/${path.parse(filename).name}`;
      return publicId;
    } catch (error) {
      return null;
    }
  }
}
