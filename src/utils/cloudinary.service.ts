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

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder },
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
